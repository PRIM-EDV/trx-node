import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Level } from "level";

import * as path from "path";

import { IMeshtasticNodeRepository } from "../../../core/meshtastic/interfaces/meshtastic-node.repository.interface";
import { MeshtasticNodeDbo } from "./schemas/meshtastic-node.schema";
import { MeshtasticNode } from "src/core/meshtastic/models/meshtastic-node.model";


@Injectable()
export class MeshtasticNodeRepository implements IMeshtasticNodeRepository {
    private readonly db: Level<string, MeshtasticNodeDbo> = new Level(path.join(process.cwd(), 'db'), { valueEncoding: 'json' });

    constructor(
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(MeshtasticNodeRepository.name);
    }

    public async delete(node: MeshtasticNode): Promise<void> {
        await this.db.del(node.id);
    }

    public async store(node: MeshtasticNode): Promise<void> {
        try {
            const dbo: MeshtasticNodeDbo = new MeshtasticNodeDbo(
                {
                    id: node.id,
                    longName: node.longName,
                    shortName: node.shortName
                }
            );

            await this.db.put(node.id, dbo);
        } catch (error) {
            // this.logger.error(`Error storing meshtastic node: ${error.message}`);
        }
    }

    public async get(): Promise<MeshtasticNode[]>;
    public async get(id: string): Promise<MeshtasticNode | undefined>;
    public async get(id?: string): Promise<MeshtasticNode | MeshtasticNode[] | undefined> {
        try {
            if (id === undefined) {
                const nodes: MeshtasticNode[] = [];
                for await (const [, value] of this.db.iterator()) {
                    nodes.push(value);
                }
                return nodes;
            }
            return await this.db.get(id);
        } catch (error) {
            if (error instanceof Error && 'notFound' in error && error.notFound) return undefined;
            throw error;
        }
    }
}
