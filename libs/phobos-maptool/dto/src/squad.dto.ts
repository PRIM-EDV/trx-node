import { Squad, SquadState } from '@phobos-maptool/models';
import { SquadDto, SquadDtoState } from '@phobos-maptool/protocol';

export function fromSquadDto(dto: SquadDto): Squad {
    return {
        name: dto.name,
        position: dto.position,
        callsign: dto.callsign,
        combattants: dto.combattants,
        state: fromState(dto.state)
    }
}

export function toSquadDto(squad: Squad): SquadDto {
    return {
        name: squad.name,
        position: squad.position,
        callsign: squad.callsign,
        combattants: squad.combattants,
        state: toState(squad.state)
    }
}

function fromState(state: SquadDtoState): SquadState {
    switch (state) {
        case 0:
        case SquadDtoState.SQUAD_STATE_UNDEFINED:
            return SquadState.UNDEFINED;
        case 1:
        case SquadDtoState.SQUAD_STATE_UNSTAGED:
            return SquadState.UNSTAGED;
        case 2:
        case SquadDtoState.SQUAD_STATE_READY:
            return SquadState.READY;
        case 3:
        case SquadDtoState.SQUAD_STATE_QRF_READY:
            return SquadState.QRF_READY;
        case 4:
        case SquadDtoState.SQUAD_STATE_IN_FIELD:
            return SquadState.IN_FIELD;
        default:
            throw new Error(`Unknown squad state: ${state}`);
    }
}

function toState(state: SquadState): SquadDtoState {
    switch (state) {
        case 0:
        case SquadState.UNDEFINED:
            return SquadDtoState.SQUAD_STATE_UNDEFINED;
        case 1:
        case SquadState.UNSTAGED:
            return SquadDtoState.SQUAD_STATE_UNSTAGED;
        case 2:
        case SquadState.READY:
            return SquadDtoState.SQUAD_STATE_READY;
        case 3:
        case SquadState.QRF_READY:
            return SquadDtoState.SQUAD_STATE_QRF_READY;
        case 4:
        case SquadState.IN_FIELD:
            return SquadDtoState.SQUAD_STATE_IN_FIELD;
        default:
            throw new Error(`Unknown squad state: ${state}`);
    }
}