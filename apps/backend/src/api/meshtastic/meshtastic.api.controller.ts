import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Request } from "@trx/protocol";

import { TrxRpcGateway } from "src/infrastructure/rpc/trx/trx.rpc.gateway";
import { MeshtasticPacket } from "@trx/protocol/dist/trx.meshtastic";
import { MeshtasticDecoder } from "src/infrastructure/protocol/meshtastic/meshtastic.decoder";
import { PortNum, User, Position, TAKPacket } from "@meshtastic/protocol";
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
    try {
      if (request.processMeshtasticPayload) {
        const packet = request.processMeshtasticPayload.packet;
        if (!packet) return;

        await this.handlePacket(packet);
      }
    } catch (error) {
      this.logger.error(`Failed to handle meshtastic request: ${error instanceof Error ? error.message : error}`);
    }

  }

  private async handlePacket(packet: MeshtasticPacket) {
    try {
      const { header, data } = MeshtasticDecoder.decodeMeshtasticPacket(packet.data);

      this.logger.debug(`Received Meshtastic packet from ${header.from} on port ${PortNum[data.portnum]}: ${JSON.stringify(data)}`);

      switch (data.portnum) {
        case PortNum.POSITION_APP:
          const position = Position.decode(data.payload);
          this.service.handlePosition(header.from, position);
          break;
        case PortNum.NODEINFO_APP:
          const nodeInfo = User.decode(data.payload);
          this.service.handleNodeInfo(header.from, nodeInfo);
          break;
        case PortNum.ATAK_PLUGIN:
          const takPacket = TAKPacket.decode(data.payload);
          this.service.handleTakPacket(header.from, takPacket);
          break;
        default:
          break;
      }
    } catch (err) {
      this.logger.error(`Failed to handle Meshtastic packet: ${err instanceof Error ? err.message : err}`);
    }
  }
}