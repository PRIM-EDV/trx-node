import { MapEntity } from "@phobos-maptool/models";

export interface IMaptoolRpcAdapter {
    setEntity(entity: MapEntity): Promise<void>;
    getAllMapEntities(): Promise<MapEntity[]>;
}