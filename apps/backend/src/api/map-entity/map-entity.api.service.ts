import { Inject, Injectable } from "@nestjs/common";

import { IMapEntityRpcAdapter } from "src/core/map-entity/interfaces/map-entity.rpc.adapter.interface";
import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { MapEntityRpcGateway } from "src/infrastructure/rpc/map-entity/map-entity.rpc.gateway";

const MapEntityRpcAdapter = () => Inject('MapEntityRpcAdapter');

@Injectable()
export class MapEntityApiService {
    constructor(
        private readonly gateway: MapEntityRpcGateway,
        private readonly mapEntity: MapEntityService,
        @MapEntityRpcAdapter() private readonly rpc: IMapEntityRpcAdapter,
    ) { 
        this.gateway.onOpen.subscribe(() => this.handleOnOpen());
    }

    private async handleOnOpen() {
        const entities = await this.rpc.getAllMapEntities();
        this.mapEntity.entities = entities;
    }
}
