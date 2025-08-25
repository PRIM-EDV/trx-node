import { MapEntity, MapEntityType } from "@phobos-maptool/models";
import { Entity, Type } from "@trx/protocol";

export function fromEntityType(entityType: Type): MapEntityType {
    switch (entityType) {
        case Type.SQUAD:
            return MapEntityType.FRIEND;
        case Type.ENEMY:
            return MapEntityType.FOE;
        case Type.UNRECOGNIZED:
            return MapEntityType.OBJECT;
    }
}

export function toEntity(mapEntity: MapEntity, entityId: number): Entity {
    const entity: Entity = {
        id: entityId,
        position: mapEntity.position,
        type: toEntityType(mapEntity.type)
    }
    return entity;
}

export function toEntityType(mapEntityType: MapEntityType): Type {
    switch (mapEntityType) {
        case MapEntityType.FRIEND:
            return Type.SQUAD;
        case MapEntityType.FOE:
            return Type.ENEMY;
        case MapEntityType.OBJECT:
            return Type.UNRECOGNIZED;
    }
}
