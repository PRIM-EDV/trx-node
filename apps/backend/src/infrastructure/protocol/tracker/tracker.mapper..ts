import { TrackerDto, TrackerDto_Type } from "@phobos-maptool/protocol/dist/phobos.maptool.tracker";
import { Tracker, Type } from "@trx/protocol";

export namespace TrackerMapper {
    export function fromTrackerDto(trackerDto: TrackerDto): Tracker {
        const tracker: Tracker = {
            id: trackerDto.id,
            position: trackerDto.position,
            type: fromTrackerDtoType(trackerDto.type),
            size: trackerDto.size,
        }
        return tracker;
    }

    export function toTrackerDto(tracker: Tracker): TrackerDto {
        const trackerDto: TrackerDto = {
            id: tracker.id,
            position: tracker.position,
            type: toTrackerDtoType(tracker.type),
            size: tracker.size,
        }
        return trackerDto;
    }
}

 function fromTrackerDtoType(trackerDtoType: TrackerDto_Type): Type {
        switch (trackerDtoType) {
            case TrackerDto_Type.TYPE_FRIEND:
                return Type.SQUAD;
            case TrackerDto_Type.TYPE_FOE:
                return Type.ENEMY;
            case TrackerDto_Type.TYPE_OBJECT:
                return Type.UNRECOGNIZED;
            default:
                throw new Error(`Unknown TrackerDto_Type: ${trackerDtoType}`);
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
