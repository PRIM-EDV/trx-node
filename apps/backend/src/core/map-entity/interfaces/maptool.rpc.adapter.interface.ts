import { MapEntity } from "@phobos-maptool/models";
import { TrackerDto } from "@phobos-maptool/protocol/dist/phobos.maptool.tracker";

export interface IMaptoolRpcAdapter {
    setEntity(entity: MapEntity): Promise<void>;
    setTracker(tracker: TrackerDto): Promise<void>;
    getAllMapEntities(): Promise<MapEntity[]>;
}