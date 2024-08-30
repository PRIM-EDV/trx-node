import { Injectable } from "@nestjs/common";
import { TrackerRpcGateway } from "./tracker.rpc.gateway";
import { ITrackerRpcAdapter } from "src/core/map-entity/interfaces/tracker.rpc.adapter.interface";
import { MapEntity } from "proto/trx.entity";

@Injectable()
export class TrackerRpcAdapter implements ITrackerRpcAdapter {

    constructor(private readonly gateway: TrackerRpcGateway) { }
    
    public async setMapEntity(entity: MapEntity): Promise<void> {
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