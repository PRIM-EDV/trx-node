import { Injectable } from "@nestjs/common";
import { Tracker } from "proto/trx.tracker";

@Injectable()
export class TrackerService {


    public get(id: number): Tracker {
        return {id: id, position: {x: 0, y: 0}};
    }

    public set(tracker: Tracker): void {

    }
}
