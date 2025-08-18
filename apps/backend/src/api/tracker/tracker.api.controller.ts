import { Injectable } from "@nestjs/common";
import { Request } from "proto/trx";
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
        if (request.setTracker) {
            const tracker = request.setTracker.tracker;
            this.mapEntity.updatePosition(tracker.id, tracker.position);
        }
    }
}