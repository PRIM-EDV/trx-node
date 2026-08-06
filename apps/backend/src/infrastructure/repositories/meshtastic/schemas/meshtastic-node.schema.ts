import type { MeshtasticNode } from 'src/core/meshtastic/models/meshtastic-node.model';

export class MeshtasticNodeDbo implements MeshtasticNode {
    public id: string = '';
    public longName: string = '';
    public shortName: string = '';

    public constructor(init?: Partial<MeshtasticNode>) {
        Object.assign(this, init);
    }

    public validate(): string[] {
        const errors: string[] = [];
        if (!this.id) errors.push("id is required");
        return errors;
    }
}