import { Tracker } from "@trx/protocol";

export interface ITrxRpcAdapter {
    setTracker(tracker: Tracker): Promise<void>;
}