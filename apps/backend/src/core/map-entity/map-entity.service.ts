import { Inject, Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { MapEntity, MapEntityType } from "@phobos-maptool/models";

import { IMaptoolRpcAdapter } from "./interfaces/maptool.rpc.adapter.interface";
import { ITrxRpcAdapter } from "./interfaces/trx.rpc.adapter.interface";
import { toTracker } from "src/infrastructure/protocol/map-entity/entity.mapper";


const MaptoolRpcAdapter = () => Inject('MaptoolRpcAdapter');
const TrxRpcAdapter = () => Inject('TrxRpcAdapter');

@Injectable()
export class MapEntityService {

    public entities: MapEntity[] = [];

    private objectIdMap: Map<string, number> = new Map();
    private foeIdMap: Map<string, number> = new Map();
    private friendIdMap: Map<string, number> = new Map();

    constructor(
        @MaptoolRpcAdapter() private readonly maptoolRpcAdapter: IMaptoolRpcAdapter,
        @TrxRpcAdapter() private readonly trxRpcAdapter: ITrxRpcAdapter,
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(MapEntityService.name);
        setInterval(this.updateTracker(), 10000);
    }

    public setEntity(entity: MapEntity): void {
        this.logger.debug(`Setting entity ${JSON.stringify(entity)}`);
        
        const existing = this.entities.find(e => e.id === entity.id);
        if (existing) {
            Object.assign(existing, entity);

        } else {
            this.entities.push(entity);

            switch (entity.type) {
                case MapEntityType.FRIEND:
                    this.assignId(entity, this.friendIdMap, 43, 63);
                    break;
                case MapEntityType.FOE:
                    this.assignId(entity, this.foeIdMap, 1, 32);
                    break;
                case MapEntityType.OBJECT:
                    this.assignId(entity, this.objectIdMap, 1, 32);
            }
        }
    }

    public updatePosition(id: number, position: { x: number, y: number }, type: MapEntityType): void {
        const entity = this.entities.find(e => (e.type == MapEntityType.FRIEND && e.entity.trackerId === id));
        if (entity) {
            entity.position = position;
            this.maptoolRpcAdapter.setEntity(entity);
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
                    id = entity.entity.trackerId > 0 ? entity.entity.trackerId : this.friendIdMap.get(entity.id)!;
                    break;
                case MapEntityType.OBJECT:
                    id = this.objectIdMap.get(entity.id)!;
                    break;
                default:
                    return;
            }
            console.log(`Setting 'Tracker' with id: ${id} for entity-type: ${entity.type}`);
            this.trxRpcAdapter.setTracker(toTracker(entity, id));
        };
    };
}