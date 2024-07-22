import { Injectable } from "@nestjs/common";
import { TrackerRpcGateway } from "./tracker.rpc.gateway";
import { Tracker } from "proto/trx.tracker";

@Injectable()
export class TrackerRpcAdapter {

    constructor(private readonly gateway: TrackerRpcGateway) { }
    
    public async setTracker(tracker: Tracker) {
        try {
            const req = {};
            // const req: Request = {
            //     setTracker: { tracker: {id: info.id, postion: {x: info.px, y: info.py}} }
            // }
            // this.websocket.request(req);
            this.gateway.request
        } catch {

        }
    }
}