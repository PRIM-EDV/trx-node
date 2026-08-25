import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { User } from "@meshtastic/protocol";

import { IMeshtasticNodeRepository } from "src/core/meshtastic/interfaces/meshtastic-node.repository.interface";
import { MeshtasticNode } from "./models/meshtastic-node.model";

const MeshtasticNodeRepository = () => Inject('MeshtasticNodeRepository');

@Injectable()
export class MeshtasticService {

    constructor(
        @MeshtasticNodeRepository() private readonly meshtasticNodeRepository: IMeshtasticNodeRepository,
        private readonly logger: WinstonLogger
    ) {
       this.logger.setContext(MeshtasticService.name);
    }

    public async setNode(from: number, nodePacket: User) {
        this.logger.debug(`Setting node ${nodePacket.id} from ${from} ${nodePacket.shortName} / ${nodePacket.longName}`);
        const node: MeshtasticNode = {
            id: nodePacket.id,
            from: from,
            shortName: nodePacket.shortName,
            longName: nodePacket.longName
        };

        await this.meshtasticNodeRepository.store(node);
    }

    public async getNode(from: number): Promise<MeshtasticNode | undefined> {
        const nodes = await this.meshtasticNodeRepository.get();
        return await this.meshtasticNodeRepository.get(from);
    }
}
