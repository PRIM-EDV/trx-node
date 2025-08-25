import { Injectable } from '@nestjs/common';
import { MaptoolMessage, Request, Response } from '@phobos-maptool/protocol';

import { v4 as uuidv4 } from 'uuid';

import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const MAPTOOL_HOSTNAME = process.env.MAPTOOL_HOSTNAME ? process.env.MAPTOOL_HOSTNAME : 'localhost';
const MAPTOOL_PORT = process.env.MAPTOOL_PORT ? process.env.MAPTOOL_PORT : 3002;
const token = {"token":"eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOltdLCJleHAiOjI1OTIwMDAwMDAsImlhdCI6MTc1NjE0MTc4Miwic2NvcGUiOiJvcGVyYXRvciJ9.Ay61VTU-P4pNBei8uKVwF3HQleUvlCEWvykNImdu-JjV05mOHmg7bT7U_sH_oLg60cqL2gXa1XK2vSI4lJcHoUbHGRiHIcYg0jV3aZI_v9yaL_43l9DluBCq9Mhl5DaUOPdVMwPRNM2zpkMPy-lHht_30HOUUd_lYA1ShaxQANuo0z53X-ltsXeL1H2-IxTm1WLRu7fhUqKDv49JOmZBPtiiIZXKZIHqCZYS3OMVJ29hJUpPoVM9vMLbEwTVx3jbNQnkT143v9PikU2Hi7Qjj_er6Nc6PKYFIGQEokyq7gASbnvLGqDzWeCiQ9pMdahUnWxubiLcmB0E9sR-D7y_RQ"}

@Injectable()
export class MapEntityRpcGateway {
    public onMessage: Subject<MaptoolMessage> = new Subject<MaptoolMessage>();
    public onRequest: Subject<{ msgId: string, request: Request }> = new Subject<{ msgId: string, request: Request }>();

    protected requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();

    public onOpen: Subject<void> = new Subject<void>();
    public onClose: Subject<void> = new Subject<void>();

    private ws!: WebSocketSubject<any>;

    constructor() {
        console.log('MapEntityRpcGateway initialized');
        this.connect()
    }

    public connect() {
        try {
            console.log(`Connecting to WebSocket on ws://${MAPTOOL_HOSTNAME}:${MAPTOOL_PORT} ...`);
            this.ws = webSocket({ url: `ws://${MAPTOOL_HOSTNAME}:${MAPTOOL_PORT}?token=${token.token}`, openObserver: { next: this.handleWsOpen.bind(this) } });

            this.ws.subscribe({
                next: this.handleWsMessage.bind(this),
                error: (err) => { console.error('WebSocket error:', err); setTimeout(this.connect.bind(this), 5000); },
                complete: this.handleWsClose.bind(this)
            });
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    }

    public error(error) {
        console.error('WebSocket error:', error);
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

    private handleWsOpen() {
        console.log('WebSocket connected');
        this.onOpen.next();
    }

    public respond(clientId: string, msgId: string, res: Response) {
        const msg: MaptoolMessage = {
            id: msgId,
            response: res
        }
        this.ws.next({ event: 'msg', data: JSON.stringify(MaptoolMessage.toJSON(msg)) });
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
        setTimeout(this.connect, 5000);
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if (this.requests.delete(id)) {
            reject();
        };
    }
}
