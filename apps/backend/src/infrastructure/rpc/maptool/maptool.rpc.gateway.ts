import { Injectable } from '@nestjs/common';
import { WinstonLogger } from '@phobos/infrastructure';
import { MaptoolMessage, Request, Response } from '@phobos-maptool/protocol';

import { v4 as uuidv4 } from 'uuid';
import { inspect } from 'node:util';

import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const MAPTOOL_HOSTNAME = process.env.MAPTOOL_HOSTNAME ? process.env.MAPTOOL_HOSTNAME : 'localhost';
const MAPTOOL_PORT = process.env.MAPTOOL_PORT ? process.env.MAPTOOL_PORT : 3002;
const token = process.env.MAPTOOL_TOKEN;

@Injectable()
export class MaptoolRpcGateway {
    public onMessage: Subject<MaptoolMessage> = new Subject<MaptoolMessage>();
    public onRequest: Subject<{ msgId: string, request: Request }> = new Subject<{ msgId: string, request: Request }>();

    protected requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();

    public onOpen: Subject<void> = new Subject<void>();
    public onClose: Subject<void> = new Subject<void>();

    private ws!: WebSocketSubject<any>;

    constructor(private readonly logger: WinstonLogger) {
        this.logger.setContext(MaptoolRpcGateway.name);
        this.connect()
    }

    public connect() {
        try {
            this.logger.log(`Connecting to WebSocket on ws://${MAPTOOL_HOSTNAME}:${MAPTOOL_PORT} ...`);
            this.ws = webSocket({ url: `ws://${MAPTOOL_HOSTNAME}:${MAPTOOL_PORT}/app/maptool?token=${token}`, openObserver: { next: this.handleWsOpen.bind(this) } });

            this.ws.subscribe({
                next: this.handleWsMessage.bind(this),
                error: this.handleWsError.bind(this),
                complete: this.handleWsClose.bind(this)
            });
        } catch (error) {
            (() => {this.logger.error(`Error connecting to WebSocket: ${inspect(error)}`); })();
        }
    }

    public send() {

    }

    public async request(req: Request): Promise<Response> {
        return new Promise((resolve, reject) => {
            const msg: MaptoolMessage = {
                id: uuidv4(),
                request: req
            }

            this.requests.set(msg.id, resolve.bind(this));
            setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject), 5000);
            this.ws.next({ event: 'msg', data: JSON.stringify(MaptoolMessage.toJSON(msg)) });
        });
    }

    public respond(clientId: string, msgId: string, res: Response) {
    const msg: MaptoolMessage = {
        id: msgId,
        response: res
    }
    this.ws.next({ event: 'msg', data: JSON.stringify(MaptoolMessage.toJSON(msg)) });
    }

    public error() {}

    private handleWsOpen() {
        this.logger.log('WebSocket connected');
        this.onOpen.next();
    }

    private handleWsMessage(buffer: { event: 'msg', data: string }) {
        const msg = MaptoolMessage.fromJSON(JSON.parse(buffer.data));

        if (msg.request) {
            this.onRequest.next({ msgId: msg.id, request: msg.request });
        }

        if (msg.response) {
            if (this.requests.has(msg.id)) {
                this.requests.get(msg.id)!(msg.response);
                this.requests.delete(msg.id);
            }
        }

        this.onMessage.next(msg);
    }

    private handleWsClose() {
        this.onClose.next();
        setTimeout(this.connect.bind(this), 5000);
    }

    private handleWsError(err: any) {
        this.logger.error(`WebSocket to maptool encountered an error error: ${err.error.code}`);
        setTimeout(this.connect.bind(this), 5000);
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if (this.requests.delete(id)) {
            reject();
        };
    }
}
