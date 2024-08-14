import { RpcHandler, Rpc } from "lib/rpc/decorators";
import { SetMapEntity_Request } from "proto/trx.entity";
import { Ws } from "src/common/interfaces/ws";
import { MapEntityRpcGateway } from "src/infrastructure/rpc/map-entity/map-entity.rpc.gateway";
import { TrackerService } from "src/core/tracker/tracker.service";
import { MapEntityService } from "src/core/map-entity/map-entity.service";

 @RpcHandler(MapEntityRpcGateway)
 export class MapEntityApiController {

    
     constructor(
        private readonly mapEntity: MapEntityService,
        private readonly tracker: TrackerService,
    ){}

     @Rpc()
     SetMapEntity(client: Ws, req: SetMapEntity_Request) {
        if (req.entity.squad?.trackerId) {
            this.tracker.set({id: req.entity.squad.trackerId, position: req.entity.position});
        } else {
            this.mapEntity.set(req.entity);
        }
     }
 }