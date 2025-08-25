import { Entity } from "@trx/protocol";

export interface ITrackerRpcAdapter {
    setEntity(entity: Entity): Promise<void>;
}