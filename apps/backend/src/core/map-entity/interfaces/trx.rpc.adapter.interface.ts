import { Tracker, ModemConfig } from "@trx/protocol";

export interface ITrxRpcAdapter {
    setTracker(tracker: Tracker): Promise<void>;
    setModemConfig(config: ModemConfig): Promise<void>;
}