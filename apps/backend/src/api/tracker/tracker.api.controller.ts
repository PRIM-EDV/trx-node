import { Injectable } from "@nestjs/common";
import { Request } from "@trx/protocol";
import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { TrackerRpcGateway } from "src/infrastructure/rpc/tracker/tracker.rpc.gateway";

@Injectable()
export class TrackerApiService {
    constructor(
        private readonly gateway: TrackerRpcGateway,
        private readonly mapEntity: MapEntityService
    ) {
        this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
    }

    private handleRequest({ msgId, request }: { msgId: string, request: Request }) {
        if (request.setEntity) {
            const entity = request.setEntity.entity;
            this.mapEntity.updatePosition(entity.id, entity.position);
        }
    }
}