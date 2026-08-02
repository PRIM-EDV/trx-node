import { Injectable } from "@nestjs/common";
import { Request } from "@trx/protocol";

import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { fromTrackerType } from "src/infrastructure/mapper/entity.mapper.service";
import { TrxRpcGateway } from "src/infrastructure/rpc/trx/trx.rpc.gateway";

@Injectable()
export class TrackerApiController {
    constructor(
        private readonly gateway: TrxRpcGateway,
        private readonly mapEntity: MapEntityService
    ) {
        this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
    }

    private handleRequest({ msgId, request }: { msgId: string, request: Request }) {
        if (request.setTracker) {
            const tracker = request.setTracker.tracker;
            const entityType = fromTrackerType(tracker.type);
            this.mapEntity.updatePosition(tracker.id, tracker.position, entityType);
        }
    }
}