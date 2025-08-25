import { Injectable } from "@nestjs/common";
import { Entity, Request } from "@trx/protocol";

import { TrackerRpcGateway } from "./tracker.rpc.gateway";
import { ITrackerRpcAdapter } from "src/core/map-entity/interfaces/tracker.rpc.adapter.interface";


@Injectable()
export class TrackerRpcAdapter implements ITrackerRpcAdapter {

    constructor(private readonly gateway: TrackerRpcGateway) { 
        console.log("TrackerRpcAdapter initialized");
    }
    
    public async setEntity(entity: Entity): Promise<void> {
        try {
            const reqquest: Request = {
                setEntity: { entity }
            };
            await this.gateway.request(reqquest);
        } catch {
            console.error("Error occurred while setting entity:", entity);
        }
    }
}