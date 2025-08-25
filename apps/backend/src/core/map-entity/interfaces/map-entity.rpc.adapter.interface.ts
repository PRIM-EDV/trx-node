import { MapEntity } from "@phobos-maptool/models";

export interface IMapEntityRpcAdapter {
    setEntity(entity: MapEntity): Promise<void>;
    getAllMapEntities(): Promise<MapEntity[]>;
}