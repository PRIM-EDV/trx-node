import { Tracker } from "proto/trx.tracker";

export interface IMapEntityRpcAdapter {
    setTracker(tracker: Tracker): Promise<void>;
}