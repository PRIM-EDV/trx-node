import { Inject, Injectable } from "@nestjs/common";
import { MapEntity, MapEntityType } from "@phobos-maptool/models";

import { IMapEntityRpcAdapter } from "./interfaces/map-entity.rpc.adapter.interface";
import { ITrackerRpcAdapter } from "./interfaces/tracker.rpc.adapter.interface";
import { toEntity } from "src/infrastructure/mapper/entity.mapper.service";


const MapEntityRpcAdapter = () => Inject('MapEntityRpcAdapter');
const TrackerRpcAdapter = () => Inject('TrackerRpcAdapter');

@Injectable()
export class MapEntityService {

    public entities: MapEntity[] = [];

    private objectIdMap: Map<string, number> = new Map();
    private foeIdMap: Map<string, number> = new Map();
    private friendIdMap: Map<string, number> = new Map();

    private updateTracker = () => {
        let index = 0;

        return () => {
            if (this.entities.length === 0) return;

            index = (index + 1) % this.entities.length;
            const entity = this.entities[index];

            let id: number;
            switch (entity.type) {
                case MapEntityType.FOE:
                    id = this.foeIdMap.get(entity.id)!;
                    break;
                case MapEntityType.FRIEND:
                    id = entity.entity.trackerId > 0? entity.entity.trackerId : this.friendIdMap.get(entity.id)!;
                    break;
                case MapEntityType.OBJECT:
                    id = this.objectIdMap.get(entity.id)!;
                    break;
                default:
                    return;
            }
            this.trackerRpcAdapter.setEntity(toEntity(entity, id));
        };
    };

    constructor(
        @MapEntityRpcAdapter() private readonly mapEntityRpcAdapter: IMapEntityRpcAdapter,
        @TrackerRpcAdapter() private readonly trackerRpcAdapter: ITrackerRpcAdapter
    ) {
        setInterval(this.updateTracker(), 10000);
    }

    public setEntity(entity: MapEntity): void {
        console.log("Setting entity" + JSON.stringify(entity));
        const existing = this.entities.find(e => e.id === entity.id);
        if (existing) {
            Object.assign(existing, entity);

        } else {
            this.entities.push(entity);

            switch (entity.type) {
                case MapEntityType.FRIEND:
                    this.assignId(entity, this.friendIdMap, 64, 128);
                    break;
                case MapEntityType.FOE:
                    this.assignId(entity, this.foeIdMap, 0, 32);
                    break;
                case MapEntityType.OBJECT:
                    this.assignId(entity, this.objectIdMap, 0, 32);
            }
        }
    }

    public updatePosition(id: number, position: { x: number, y: number }, type: MapEntityType): void {
        const entity = this.entities.find(e => (e.type == MapEntityType.FRIEND && e.entity.trackerId === id));
        if (entity) {
            entity.position = position;
            this.mapEntityRpcAdapter.setEntity(entity);
        }
    }

    public remove(entity: MapEntity): void {
        this.entities = this.entities.filter(e => e.id !== entity.id);

        switch (entity.type) {
            case MapEntityType.FRIEND:
                this.friendIdMap.delete(entity.id);
                break;
            case MapEntityType.FOE:
                this.foeIdMap.delete(entity.id);
                break;
            case MapEntityType.OBJECT:
                this.objectIdMap.delete(entity.id);
        }
    }

    private assignId(entity: MapEntity, map: Map<string, number>, start: number, stop: number): number {
        if (map.has(entity.id)) return map.get(entity.id)!;

        for (let i = start; i <= stop; i++) {
            if (![...map.values()].includes(i)) {
                map.set(entity.id, i);
                return i;
            }
        }
        return -1;
    }
}