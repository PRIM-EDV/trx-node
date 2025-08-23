"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMapEntityDto = fromMapEntityDto;
exports.toMapEntityDto = toMapEntityDto;
const models_1 = require("@phobos-maptool/models");
const protocol_1 = require("@phobos-maptool/protocol");
function fromMapEntityDto(dto) {
    const base = {
        id: dto.id,
        position: dto.position ? dto.position : { x: 0, y: 0 },
        notes: dto.notes ?? "",
        entity: fromDtoEntity(dto),
        symbol: dto.symbol ?? -1,
    };
    switch (dto.type) {
        case 1:
        case protocol_1.MapEntityDtoType.TYPE_FOE:
            return {
                ...base,
                type: models_1.MapEntityType.FOE,
                entity: fromDtoEntity(dto),
            };
        case 2:
        case protocol_1.MapEntityDtoType.TYPE_FRIEND:
            return {
                ...base,
                type: models_1.MapEntityType.FRIEND,
                entity: fromDtoEntity(dto),
            };
        case 3:
        case protocol_1.MapEntityDtoType.TYPE_OBJECT:
            return {
                ...base,
                type: models_1.MapEntityType.OBJECT,
                entity: fromDtoEntity(dto),
            };
        default:
            throw new Error(`Error while parsing MapEntityDto entity: Unknown MapEntityDtoType: ${dto.type}`);
    }
}
function toMapEntityDto(mapEntity) {
    return {
        id: mapEntity.id,
        type: toDtoType(mapEntity.type),
        position: mapEntity.position,
        notes: mapEntity.notes ?? "",
        symbol: mapEntity.symbol ?? -1,
        squad: mapEntity.type === models_1.MapEntityType.FRIEND ? toDtoSquad(mapEntity.entity) : undefined,
        enemy: mapEntity.type === models_1.MapEntityType.FOE ? toDtoEnemy(mapEntity.entity) : undefined,
        objective: mapEntity.type === models_1.MapEntityType.OBJECT ? toDtoObjective(mapEntity.entity) : undefined,
    };
}
function fromDtoEntity(dto) {
    switch (dto.type) {
        case 1:
        case protocol_1.MapEntityDtoType.TYPE_FOE:
            return fromDtoEnemy(dto.enemy);
        case 2:
        case protocol_1.MapEntityDtoType.TYPE_FRIEND:
            return fromDtoSquad(dto.squad);
        case 3:
        case protocol_1.MapEntityDtoType.TYPE_OBJECT:
            return fromDtoObjective(dto.objective);
        default:
            throw new Error(`Error while parsing MapEntityDto entity: Unknown MapEntityDtoType: ${dto.type}`);
    }
}
function fromDtoEnemy(dto) {
    return {
        combattants: dto.combattants,
    };
}
function fromDtoSquad(dto) {
    return {
        name: dto.name,
        callsign: dto.callsign,
        trackerId: dto.trackerId,
        combattants: dto.combattants,
        status: fromDtoStatus(dto.status),
    };
}
function fromDtoObjective(dto) {
    return {
        name: dto.name,
        description: dto.description,
    };
}
function fromDtoStatus(status) {
    switch (status) {
        case 0:
        case protocol_1.MapEntityDtoStatus.ENTITY_STATUS_UNDEFINED:
            return models_1.MapEntityStatus.UNDEFINED;
        case 1:
        case protocol_1.MapEntityDtoStatus.ENTITY_STATUS_REGULAR:
            return models_1.MapEntityStatus.REGULAR;
        case 2:
        case protocol_1.MapEntityDtoStatus.ENTITY_STATUS_COMBAT:
            return models_1.MapEntityStatus.COMBAT;
        default:
            throw new Error(`Error while parsing MapEntityDtoStatus: Unknown MapEntityDtoStatus: ${status}`);
    }
}
function toDtoEnemy(enemy) {
    return {
        combattants: enemy.combattants,
    };
}
function toDtoSquad(squad) {
    return {
        name: squad.name,
        callsign: squad.callsign,
        trackerId: squad.trackerId,
        combattants: squad.combattants,
        status: toDtoStatus(squad.status),
    };
}
function toDtoObjective(objective) {
    return {
        name: objective.name,
        description: objective.description,
    };
}
function toDtoType(type) {
    switch (type) {
        case 0:
        case models_1.MapEntityType.UNDEFINED:
            return protocol_1.MapEntityDtoType.TYPE_UNDEFINED;
        case 1:
        case models_1.MapEntityType.FOE:
            return protocol_1.MapEntityDtoType.TYPE_FOE;
        case 2:
        case models_1.MapEntityType.FRIEND:
            return protocol_1.MapEntityDtoType.TYPE_FRIEND;
        case 3:
        case models_1.MapEntityType.OBJECT:
            return protocol_1.MapEntityDtoType.TYPE_OBJECT;
        default:
            throw new Error(`Error while converting MapEntityType to MapEntityDtoType: Unknown MapEntityType: ${type}`);
    }
}
function toDtoStatus(status) {
    switch (status) {
        case 0:
        case models_1.MapEntityStatus.UNDEFINED:
            return protocol_1.MapEntityDtoStatus.ENTITY_STATUS_UNDEFINED;
        case 1:
        case models_1.MapEntityStatus.REGULAR:
            return protocol_1.MapEntityDtoStatus.ENTITY_STATUS_REGULAR;
        case 2:
        case models_1.MapEntityStatus.COMBAT:
            return protocol_1.MapEntityDtoStatus.ENTITY_STATUS_COMBAT;
        default:
            throw new Error(`Error while converting MapEntityStatus to MapEntityDtoStatus: Unknown MapEntityStatus: ${status}`);
    }
}
