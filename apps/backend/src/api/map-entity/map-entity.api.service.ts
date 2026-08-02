import { Inject, Injectable } from "@nestjs/common";

import { IMaptoolRpcAdapter } from "src/core/map-entity/interfaces/maptool.rpc.adapter.interface";
import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { MaptoolRpcGateway } from "src/infrastructure/rpc/maptool/maptool.rpc.gateway";

const MaptoolRpcAdapter = () => Inject('MaptoolRpcAdapter');

@Injectable()
export class MapEntityApiService {
    constructor(
        private readonly gateway: MaptoolRpcGateway,
        private readonly mapEntity: MapEntityService,
        @MaptoolRpcAdapter() private readonly rpc: IMaptoolRpcAdapter,
    ) {
        this.gateway.onOpen.subscribe(() => this.handleOnOpen());
    }

    private async handleOnOpen() {
        const entities = await this.rpc.getAllMapEntities();
        entities.map(entity => this.mapEntity.setEntity(entity));
    }
}
