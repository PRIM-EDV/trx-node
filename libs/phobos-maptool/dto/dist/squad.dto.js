"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSquadDto = fromSquadDto;
exports.toSquadDto = toSquadDto;
const models_1 = require("@phobos-maptool/models");
const protocol_1 = require("@phobos-maptool/protocol");
function fromSquadDto(dto) {
    return {
        name: dto.name,
        position: dto.position,
        callsign: dto.callsign,
        combattants: dto.combattants,
        state: fromState(dto.state)
    };
}
function toSquadDto(squad) {
    return {
        name: squad.name,
        position: squad.position,
        callsign: squad.callsign,
        combattants: squad.combattants,
        state: toState(squad.state)
    };
}
function fromState(state) {
    switch (state) {
        case 0:
        case protocol_1.SquadDtoState.SQUAD_STATE_UNDEFINED:
            return models_1.SquadState.UNDEFINED;
        case 1:
        case protocol_1.SquadDtoState.SQUAD_STATE_UNSTAGED:
            return models_1.SquadState.UNSTAGED;
        case 2:
        case protocol_1.SquadDtoState.SQUAD_STATE_READY:
            return models_1.SquadState.READY;
        case 3:
        case protocol_1.SquadDtoState.SQUAD_STATE_QRF_READY:
            return models_1.SquadState.QRF_READY;
        case 4:
        case protocol_1.SquadDtoState.SQUAD_STATE_IN_FIELD:
            return models_1.SquadState.IN_FIELD;
        default:
            throw new Error(`Unknown squad state: ${state}`);
    }
}
function toState(state) {
    switch (state) {
        case 0:
        case models_1.SquadState.UNDEFINED:
            return protocol_1.SquadDtoState.SQUAD_STATE_UNDEFINED;
        case 1:
        case models_1.SquadState.UNSTAGED:
            return protocol_1.SquadDtoState.SQUAD_STATE_UNSTAGED;
        case 2:
        case models_1.SquadState.READY:
            return protocol_1.SquadDtoState.SQUAD_STATE_READY;
        case 3:
        case models_1.SquadState.QRF_READY:
            return protocol_1.SquadDtoState.SQUAD_STATE_QRF_READY;
        case 4:
        case models_1.SquadState.IN_FIELD:
            return protocol_1.SquadDtoState.SQUAD_STATE_IN_FIELD;
        default:
            throw new Error(`Unknown squad state: ${state}`);
    }
}
