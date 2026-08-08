import { MeshtasticNode } from "../models/meshtastic-node.model";

export interface IMeshtasticNodeRepository {
    delete(node: MeshtasticNode): Promise<void>;
    store(node: MeshtasticNode): Promise<void>;

    get(): Promise<MeshtasticNode[]>;
    get(from: number): Promise<MeshtasticNode | undefined>;
}
