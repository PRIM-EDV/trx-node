import { Injectable } from "@nestjs/common";

import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { MapEntityRpcAdapter } from "src/infrastructure/rpc/map-entity/map-entity.rpc.adapter";
import { MapEntityRpcGateway } from "src/infrastructure/rpc/map-entity/map-entity.rpc.gateway";

@Injectable()
export class MapEntityApiService {
    constructor(
        private readonly gateway: MapEntityRpcGateway,
        private readonly rpc: MapEntityRpcAdapter,
        private readonly mapEntity: MapEntityService
    ) { }

    private async handleOnOpen() {
        const entities = await this.rpc.getAllMapEntities();
        this.mapEntity.entities = entities;
    }
}
