import { RpcHandler, Rpc } from "lib/rpc/decorators";
import { DeleteMapEntity, DeleteMapEntity_Request, SetMapEntity_Request } from "proto/trx.entity";
import { Ws } from "src/common/interfaces/ws";
import { MapEntityRpcGateway } from "src/infrastructure/rpc/map-entity/map-entity.rpc.gateway";
import { MapEntityService } from "src/core/map-entity/map-entity.service";

 @RpcHandler(MapEntityRpcGateway)
 export class MapEntityApiController {

    
     constructor(
        private readonly mapEntity: MapEntityService,
    ){}

     @Rpc()
     SetMapEntity(client: Ws, req: SetMapEntity_Request) {
        this.mapEntity.set(req.entity);
     }

    @Rpc()
    DeleteMapEntity(client: Ws, req: DeleteMapEntity_Request) {
        this.mapEntity.remove(req.entity);
    }
 }