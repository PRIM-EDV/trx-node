import { Injectable } from "@nestjs/common";
import { Entity } from "@trx/protocol";

import { TrackerRpcGateway } from "./tracker.rpc.gateway";
import { ITrackerRpcAdapter } from "src/core/map-entity/interfaces/tracker.rpc.adapter.interface";


@Injectable()
export class TrackerRpcAdapter implements ITrackerRpcAdapter {

    constructor(private readonly gateway: TrackerRpcGateway) { 
        console.log("TrackerRpcAdapter initialized");
    }
    
    public async setMapEntity(entity: Entity): Promise<void> {
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