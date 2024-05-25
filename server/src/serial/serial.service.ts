import * as cobs from 'cobs';

import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter';
import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/logging/logging.service';
import { WebsocketService } from 'src/websocket/websocket.service';
import { RldInfo, RldMessage } from 'proto/protocol';
import { Request } from 'proto/rld-node';

const SERIAL_PORT = process.env.SERIAL_PORT ? process.env.SERIAL_PORT : '/dev/ttyS0';

@Injectable()
export class SerialService {

    private serialport: SerialPort;
    private parser: DelimiterParser;

    constructor(private readonly log: LoggingService, private readonly websocket: WebsocketService) {
        this.connect()

        setInterval(this.setTracker.bind(this, {id: 12, flags: 0, px: 120, py: 120}), 10000);
    }

    public async connect() {
        this.log.info("Connecting to serial...")
        this.serialport = new SerialPort({ path: SERIAL_PORT, baudRate: 9600 });
        this.parser = this.serialport.pipe(new DelimiterParser({ delimiter: '\0' }));
        this.parser.on('data', this.handleData);
        this.serialport.on('error', () => setTimeout(this.connect.bind(this), 5000));
    }

    private handleData(data: Buffer) {
        try {
            const decoded = cobs.decode(data);
            const message = RldMessage.decode(decoded);
            console.log(decoded)
            console.log(message);
        } catch {

        }
    }

    public async setTracker(info: RldInfo) {
        try {
            const req: Request = {
                setTracker: { tracker: {id: info.id, postion: {x: info.px, y: info.py}} }
            }
            this.websocket.request(req);
        } catch {

        }
    }
}
