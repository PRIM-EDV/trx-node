import { Inject, Injectable } from "@nestjs/common";
import { MapEntity } from "proto/trx.entity";
import { IMapEntityRpcAdapter } from "./interfaces/map-entity.rpc.adapter.interface";
import { ITrackerRpcAdapter } from "./interfaces/tracker.rpc.adapter.interface";
import { Tracker } from "proto/trx.tracker";

const MapEntityRpcAdapter = () => Inject('MapEntityRpcAdapter');
const TrackerRpcAdapter = () => Inject('TrackerRpcAdapter');

@Injectable()
export class MapEntityService {
    constructor(
        @MapEntityRpcAdapter() private readonly mapEntityRpcAdapter: IMapEntityRpcAdapter,
        @TrackerRpcAdapter() private readonly trackerRpcAdapter: ITrackerRpcAdapter
    ) { }

    public set(entity: MapEntity): void {
        // create or update entity
    }

    public updatePosition(trackerId: number, postion: { x: number, y: number }): void {
        this.mapEntityRpcAdapter.setTracker({
            id: trackerId,
            position: postion
        })
    }

    public remove(entity: MapEntity): void {

    }
}