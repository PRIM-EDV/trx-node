import { Inject, Injectable } from "@nestjs/common";
import { MapEntity } from "@phobos-maptool/models";

import { IMapEntityRpcAdapter } from "./interfaces/map-entity.rpc.adapter.interface";
import { ITrackerRpcAdapter } from "./interfaces/tracker.rpc.adapter.interface";

const MapEntityRpcAdapter = () => Inject('MapEntityRpcAdapter');
const TrackerRpcAdapter = () => Inject('TrackerRpcAdapter');

@Injectable()
export class MapEntityService {

    public entities: MapEntity[] = []; 
    
    constructor(
        @MapEntityRpcAdapter() private readonly mapEntityRpcAdapter: IMapEntityRpcAdapter,
        @TrackerRpcAdapter() private readonly trackerRpcAdapter: ITrackerRpcAdapter
    ) { 

    }

    public set(entity: MapEntity): void {
        const existing = this.entities.find(e => e.id === entity.id);
        if (existing) {
            Object.assign(existing, entity);
        } else {
            this.entities.push(entity);
        }
    }

    public updatePosition(trackerId: number, postion: { x: number, y: number }): void {

    }

    public remove(entity: MapEntity): void {
        this.entities = this.entities.filter(e => e.id !== entity.id);
    }
}