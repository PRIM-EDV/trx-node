import { Entity } from "@trx/protocol";

export interface ITrackerRpcAdapter {
    setMapEntity(entity: Entity): Promise<void>;
}