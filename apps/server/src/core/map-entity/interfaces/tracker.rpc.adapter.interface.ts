import { MapEntity } from "proto/trx.entity";

export interface ITrackerRpcAdapter {
    setMapEntity(entity: MapEntity): Promise<void>;
}