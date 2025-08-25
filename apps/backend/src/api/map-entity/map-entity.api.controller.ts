import { fromMapEntityDto } from '@phobos-maptool/dto';
import { DeleteMapEntity_Request, SetMapEntity_Request } from '@phobos-maptool/protocol';

import { RpcHandler, Rpc } from "lib/rpc/decorators";
import { Ws } from "src/common/interfaces/ws";
import { MapEntityRpcGateway } from "src/infrastructure/rpc/map-entity/map-entity.rpc.gateway";
import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { MapEntityApiService } from './map-entity.api.service';

@RpcHandler(MapEntityRpcGateway)
export class MapEntityApiController {
    constructor(
        private readonly mapEntity: MapEntityService,
        private readonly service: MapEntityApiService
    ) { }

    @Rpc()
    setMapEntity(client: Ws, req: SetMapEntity_Request) {
        this.mapEntity.setEntity(fromMapEntityDto(req.entity));
    }

    @Rpc()
    deleteMapEntity(client: Ws, req: DeleteMapEntity_Request) {
        this.mapEntity.remove(fromMapEntityDto(req.entity));
    }
}