import { MeshtasticNodeDbo } from "src/infrastructure/repositories/meshtastic/schemas/meshtastic-node.schema";

export interface IMeshtasticNodeRepository {
    delete(node: MeshtasticNodeDbo): Promise<void>;
    store(node: MeshtasticNodeDbo): Promise<void>;

    get(): Promise<MeshtasticNodeDbo[]>;
    get(nodeNum: number): Promise<MeshtasticNodeDbo | undefined>;
}
