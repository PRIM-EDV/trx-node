import { Position as MeshtasticPosition } from "@meshtastic/protocol/dist/meshtastic/mesh";
import { Position } from "@trx/protocol";

const ORIGIN = { lat: 52.386332, lon: 11.80533};
const SCALER = 	Math.cos(ORIGIN.lat * Math.PI / 180) * 111300;

export namespace MeshtasticMapper {
    export function toTrackerPosition(position: MeshtasticPosition): Position {
        const latitude = (position.latitudeI ?? 0) * 1e-7;
        const longitude = (position.longitudeI ?? 0) * 1e-7;

        const trackerPosition: Position = {
            x: (longitude - ORIGIN.lon) * SCALER,
            y: (ORIGIN.lat - latitude) * 111300,
        };
        return trackerPosition;
    }
}
