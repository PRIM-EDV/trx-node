import { Position as MeshtasticPosition } from "@meshtastic/protocol/dist/meshtastic/mesh";
import { PLI } from "@meshtastic/protocol/dist/meshtastic/atak";
import { Position } from "@trx/protocol";

const ORIGIN = { lat: 52.386332, lon: 11.80533};
const SCALER = 	Math.cos(ORIGIN.lat * Math.PI / 180) * 111300;

export namespace MeshtasticMapper {
    export function toTrackerPosition(position: MeshtasticPosition): Position {
        return fromLatLonI(position.latitudeI ?? 0, position.longitudeI ?? 0);
    }

    // TAK's PLI (Position Location Information) uses the same 1e-7 degree
    // encoding as Meshtastic's own Position, since it is carried as a
    // Meshtastic Data payload (portnum ATAK_PLUGIN) rather than a separate transport.
    export function toTrackerPositionFromPli(pli: PLI): Position {
        return fromLatLonI(pli.latitudeI, pli.longitudeI);
    }

    function fromLatLonI(latitudeI: number, longitudeI: number): Position {
        const latitude = latitudeI * 1e-7;
        const longitude = longitudeI * 1e-7;

        return {
            x: (longitude - ORIGIN.lon) * SCALER,
            y: (ORIGIN.lat - latitude) * 111300,
        };
    }
}
