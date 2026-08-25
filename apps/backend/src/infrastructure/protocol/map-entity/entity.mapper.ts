import { MapEntity, MapEntityType } from "@phobos-maptool/models";
import { Tracker, Type } from "@trx/protocol";

export function fromTrackerType(entityType: Type): MapEntityType {
  switch (entityType) {
    case Type.SQUAD:
      return MapEntityType.FRIEND;
    case Type.ENEMY:
      return MapEntityType.FOE;
    case Type.UNRECOGNIZED:
      return MapEntityType.OBJECT;
    default:
      throw new Error(`Unknown Type: ${entityType}`);
  }
}

export function toTracker(mapEntity: MapEntity, trackerId: number): Tracker {
  switch (mapEntity.type) {
    case MapEntityType.FOE:
      return {
        id: trackerId,
        position: mapEntity.position,
        type: toTrackerType(mapEntity.type),
        size: mapEntity.entity.combattants,
      };
    case MapEntityType.FRIEND:
      return {
        id: trackerId,
        position: mapEntity.position,
        type: toTrackerType(mapEntity.type),
        size: mapEntity.entity.combattants,
      };
    case MapEntityType.OBJECT:
      return {
        id: trackerId,
        position: mapEntity.position,
        type: toTrackerType(mapEntity.type),
        size: 0,
      };
  }
}

export function toTrackerType(mapEntityType: MapEntityType): Type {
  switch (mapEntityType) {
    case MapEntityType.FRIEND:
      return Type.SQUAD;
    case MapEntityType.FOE:
      return Type.ENEMY;
    case MapEntityType.OBJECT:
      return Type.OBJECTIVE;
    default:
      throw new Error(`Unknown MapEntityType: ${mapEntityType}`);
  }
}
