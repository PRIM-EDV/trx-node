import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Level } from "level";

import * as path from "path";

import { IMeshtasticNodeRepository } from "../../../core/meshtastic/interfaces/meshtastic-node.repository.interface";
import { MeshtasticNodeDbo } from "./schemas/meshtastic-node.schema";


@Injectable()
export class MeshtasticNodeRepository implements IMeshtasticNodeRepository {
    private readonly db: Level<number, MeshtasticNodeDbo> = new Level(path.join(process.cwd(), 'db'), { valueEncoding: 'json' });

    constructor(
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(MeshtasticNodeRepository.name);
    }

    public async delete(node: MeshtasticNodeDbo): Promise<void> {
        await this.db.del(node.nodeNum);
    }

    public async store(node: MeshtasticNodeDbo): Promise<void> {
        try {
            await this.db.put(node.nodeNum, node);
        } catch (error) {
            // this.logger.error(`Error storing meshtastic node: ${error.message}`);
        }
    }

    public async get(): Promise<MeshtasticNodeDbo[]>;
    public async get(nodeNum?: number): Promise<MeshtasticNodeDbo | MeshtasticNodeDbo[] | undefined> {
        try {
            if (nodeNum === undefined) {
                const nodes: MeshtasticNodeDbo[] = [];
                for await (const [, value] of this.db.iterator()) {
                    nodes.push(value);
                }
                return nodes;
            }
            return await this.db.get(nodeNum);
        } catch (error) {
            if (error instanceof Error && 'notFound' in error && error.notFound) return undefined;
            throw error;
        }
    }
}
