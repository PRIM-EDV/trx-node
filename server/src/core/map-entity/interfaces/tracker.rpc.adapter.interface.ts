import { Tracker } from "proto/trx.tracker";

export interface ITrackerRpcAdapter {
    setTracker(tracker: Tracker): Promise<void>;
}