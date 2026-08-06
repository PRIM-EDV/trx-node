import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { User } from "@meshtastic/protocol";

import { IMeshtasticNodeRepository } from "src/core/meshtastic/interfaces/meshtastic-node.repository.interface";
import { MeshtasticNode } from "./models/meshtastic-node.model";

const MeshtasticNodeRepository = () => Inject('MeshtasticNodeRepository');

@Injectable()
export class MeshtasticService {

    constructor(
        @MeshtasticNodeRepository() private readonly meshtasticNodeRepository: IMeshtasticNodeRepository
    ) {}

    public async setNode(nodePacket: User) {
        const node: MeshtasticNode = {
            id: nodePacket.id,
            shortName: nodePacket.shortName,
            longName: nodePacket.longName
        };

        await this.meshtasticNodeRepository.store(node);
    }

    public async getNode(id: string): Promise<MeshtasticNode | undefined> {
        return await this.meshtasticNodeRepository.get(id);
    }
}
