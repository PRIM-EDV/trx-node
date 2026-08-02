import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Request } from "@trx/protocol";
import { MeshPacket } from "@meshtastic/protocol";

import { inspect } from 'node:util';

import { MapEntityService } from "src/core/map-entity/map-entity.service";
import { fromTrackerType } from "src/infrastructure/mapper/entity.mapper.service";
import { TrxRpcGateway } from "src/infrastructure/rpc/trx/trx.rpc.gateway";

@Injectable()
export class TrackerApiController {
    constructor(
        private readonly gateway: TrxRpcGateway,
        private readonly mapEntity: MapEntityService,
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(TrackerApiController.name);
        this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
    }

    private handleRequest({ msgId, request }: { msgId: string, request: Request }) {
        if (request.setTracker) {
            const tracker = request.setTracker.tracker;
            const entityType = fromTrackerType(tracker.type);
            this.mapEntity.updatePosition(tracker.id, tracker.position, entityType);
        }

        if (request.processMeshtasticPayload) {
            const packet = request.processMeshtasticPayload.packet;
            if (!packet) return;

            try {
                const meshPacket = MeshPacket.decode(packet.data);
                this.logger.debug(`Received meshtastic packet: ${inspect(meshPacket)}`);
            } catch (err) {
                this.logger.error(`Failed to parse meshtastic packet: ${inspect(err)}`);
            }
        }
    }
}