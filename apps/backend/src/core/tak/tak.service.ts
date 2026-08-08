import { Injectable } from "@nestjs/common";
import { TAKPacket } from "@meshtastic/protocol";
import { TrackerDto, TrackerDto_Type } from "@phobos-maptool/protocol/dist/phobos.maptool.tracker";

import { MeshtasticMapper } from "src/infrastructure/protocol/meshtastic/meshtastic.mapper";

@Injectable()
export class TakService {

    // public toTracker(packet: TAKPacket): TrackerDto | undefined {
    //     if (!packet.contact || !packet.pli) return undefined;

    //     return {
    //         id: TakService.toTrackerId(packet.contact.callsign),
    //         position: MeshtasticMapper.toTrackerPositionFromPli(packet.pli),
    //         size: 0,
    //         type: TrackerDto_Type.TYPE_UNDEFINED
    //     };
    // }

    // // TAK contacts are identified by callsign, not a numeric node number, so
    // // the tracker id (which must be a number) is derived deterministically
    // // via FNV-1a so the same callsign always maps to the same tracker.
    // public static toTrackerId(callsign: string): number {
    //     let hash = 0x811c9dc5;
    //     for (let i = 0; i < callsign.length; i++) {
    //         hash ^= callsign.charCodeAt(i);
    //         hash = Math.imul(hash, 0x01000193);
    //     }
    //     return hash >>> 0;
    // }
}
