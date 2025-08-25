import { Injectable } from "@nestjs/common";
import { TrxMessage, Request, Response } from "@trx/protocol";

import { v4 as uuidv4 } from 'uuid';
import { SerialPort, DelimiterParser } from "serialport";
import { LoggingService } from "src/infrastructure/logging/logging.service";
import { Subject } from "rxjs";

import * as cobs from 'cobs';

const SERIAL_PORT = process.env.SERIAL_PORT ? process.env.SERIAL_PORT : '/dev/ttyS0';


@Injectable()
export class TrackerRpcGateway {
    public onMessage: Subject<TrxMessage> = new Subject<TrxMessage>();
    public onRequest: Subject<{msgId: string, request: Request}> = new Subject<{msgId: string, request: Request}>();

    protected requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();

    private serialport: SerialPort;
    private parser: DelimiterParser;

    constructor(private readonly log: LoggingService) {
        this.connect()
    }

    public async connect() {
        this.log.info("Connecting to serial...")
        this.serialport = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 });
        this.parser = this.serialport.pipe(new DelimiterParser({ delimiter: '\0' }));
        this.parser.on('data', this.handleData);
        this.serialport.on('error', () => setTimeout(this.connect.bind(this), 5000));
    }

    public async request(req: Request): Promise<any> {
        return new Promise((resolve, reject) => {
            const msg: TrxMessage = {
                id: uuidv4(),
                request: req
            }

            // this.requests.set(msg.id, resolve.bind(this));
            // setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject), 5000);
            this.serialport.write(cobs.encode(TrxMessage.encode(msg)));
            resolve(null);
        });
    }

    public respond(msgId: string, res: Response) {
        const msg: TrxMessage = {
            id: msgId,
            response: res
        }
        this.serialport.write(cobs.encode(TrxMessage.encode(msg)));
    }

    private handleData(data: Buffer) {
        try {
            const decoded = cobs.decode(data);
            const msg = TrxMessage.decode(decoded);

            if(msg.request) {
                this.onRequest.next({msgId: msg.id, request: msg.request});
            }
    
            if(msg.response) {
                if(this.requests.has(msg.id)) {
                    this.requests.get(msg.id)!(msg.response);
                    this.requests.delete(msg.id);
                }
            }
    
            this.onMessage.next(msg);
        } catch (err) {
            this.log.error(err);
        }
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if (this.requests.delete(id)) {
            reject();
        };
    }
}
