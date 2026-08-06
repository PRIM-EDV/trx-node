import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Request } from "@trx/protocol";

import { TrxRpcGateway } from "src/infrastructure/rpc/trx/trx.rpc.gateway";
import { MeshtasticPacket } from "@trx/protocol/dist/trx.meshtastic";
import { MeshtasticDecoder } from "src/infrastructure/protocol/meshtastic/meshtastic.decoder";
import { PortNum, User } from "@meshtastic/protocol";
import { MeshtasticApiService } from "./meshtastic.api.service";

@Injectable()
export class MeshtasticApiController {
    constructor(
        private readonly gateway: TrxRpcGateway,
        private readonly service: MeshtasticApiService,
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(MeshtasticApiController.name);
        this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
    }

    private async handleRequest({ msgId, request }: { msgId: string, request: Request }) {
        if (request.processMeshtasticPayload) {
            const packet = request.processMeshtasticPayload.packet;
            if (!packet) return;

            await this.handlePacket(packet);
        }
    }

    private async handlePacket(packet: MeshtasticPacket) {
        const { header, data } = MeshtasticDecoder.decodeMeshtasticPacket(packet.data);

        switch (data.portnum) {
            case PortNum.POSITION_APP:
                // this.logger.debug(`Received Meshtastic packet on port 1: ${JSON.stringify(data)}`);
                break;
            case PortNum.NODEINFO_APP:
                const nodeInfo =  User.decode(data.payload);
                this.service.handleNodeInfo(nodeInfo);
                break;
            default:
                // this.logger.debug(`Received Meshtastic packet on unknown port ${data.portnum}: ${JSON.stringify(data)}`);
                break;
        }
    }
}