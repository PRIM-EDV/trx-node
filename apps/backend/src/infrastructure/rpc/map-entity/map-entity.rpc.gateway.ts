import { Injectable } from '@nestjs/common';
import { TrxMessage, Request, Response } from '@trx/protocol';

import { v4 as uuidv4 } from 'uuid';

import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const MAPTOOL_HOSTNAME = process.env.MAPTOOL_HOSTNAME ? process.env.MAPTOOL_HOSTNAME : 'localhost';
const MAPTOOL_PORT = process.env.MAPTOOL_PORT ? process.env.MAPTOOL_PORT : 3800;

@Injectable()
export class MapEntityRpcGateway {
    public onMessage: Subject<TrxMessage> = new Subject<TrxMessage>();
    public onRequest: Subject<{ msgId: string, request: Request }> = new Subject<{ msgId: string, request: Request }>();

    protected requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();

    public onOpen: Subject<void> = new Subject<void>();
    public onClose: Subject<void> = new Subject<void>();

    private ws!: WebSocketSubject<any>;

    constructor() {
        this.connect()
    }

    public connect() {
        this.ws = webSocket({ url: `ws://${MAPTOOL_HOSTNAME}:${MAPTOOL_PORT}`, openObserver: { next: this.handleWsOpen.bind(this) } });

        this.ws.subscribe({
            next: this.handleWsMessage.bind(this),
            error: (err) => { },
            complete: this.handleWsClose.bind(this)
        });
    }

    public send() {

    }

    public async request(req: Request): Promise<Response> {
        return new Promise((resolve, reject) => {
            const msg: TrxMessage = {
                id: uuidv4(),
                request: req
            }

            this.requests.set(msg.id, resolve.bind(this));
            setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject), 5000);
            this.ws.next({ event: 'msg', data: JSON.stringify(TrxMessage.toJSON(msg)) });
        });
    }

    private handleWsOpen() {
        this.onOpen.next();
    }

    public respond(clientId: string, msgId: string, res: Response) {
        const msg: TrxMessage = {
            id: msgId,
            response: res
        }
        this.ws.next({ event: 'msg', data: JSON.stringify(TrxMessage.toJSON(msg)) });
    }

    private handleWsMessage(buffer: { event: 'msg', data: string }) {
        const msg = TrxMessage.fromJSON(JSON.parse(buffer.data));

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
        setTimeout(this.connect, 5000);
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if (this.requests.delete(id)) {
            reject();
        };
    }
}
