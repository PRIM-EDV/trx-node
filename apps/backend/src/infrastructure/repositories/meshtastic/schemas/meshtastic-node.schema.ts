import type { MeshtasticNode } from 'src/core/meshtastic/models/meshtastic-node.model';

export class MeshtasticNodeDbo implements MeshtasticNode {
    public nodeNum: number = 0;
    public longName: string = '';
    public shortName: string = '';

    public validate(): string[] {
        const errors: string[] = [];
        if (!Number.isInteger(this.nodeNum)) errors.push("nodeNum must be an integer");
        return errors;
    }
}