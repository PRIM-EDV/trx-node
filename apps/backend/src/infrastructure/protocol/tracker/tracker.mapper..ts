import { TrackerDto, TrackerDto_Type } from "@phobos-maptool/protocol/dist/phobos.maptool.tracker";
import { Tracker, Type } from "@trx/protocol";

export namespace TrackerMapper {
    export function toTrackerDto(tracker: Tracker): TrackerDto {
        const trackerDto: TrackerDto = {
            id: `trx-${tracker.id}`,
            position: tracker.position,
            type: toTrackerDtoType(tracker.type),
            size: tracker.size,
        }
        return trackerDto;
    }
}

function toTrackerDtoType(trackerType: Type): TrackerDto_Type {
    switch (trackerType) {
        case Type.SQUAD:
            return TrackerDto_Type.TYPE_FRIEND;
        case Type.ENEMY:
            return TrackerDto_Type.TYPE_FOE;
        case Type.UNRECOGNIZED:
            return TrackerDto_Type.TYPE_OBJECT;
        default:
            throw new Error(`Unknown Type: ${trackerType}`);
    }
}
