import { Entity } from "@trx/protocol";


export interface IMapEntityRpcAdapter {
    setEntity(entity: Entity): Promise<void>;
}