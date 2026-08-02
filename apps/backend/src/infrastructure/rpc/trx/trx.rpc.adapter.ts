import { Injectable } from "@nestjs/common";
import { Tracker, Request } from "@trx/protocol";

import { TrxRpcGateway } from "./trx.rpc.gateway";
import { ITrxRpcAdapter } from "src/core/map-entity/interfaces/trx.rpc.adapter.interface";


@Injectable()
export class TrxRpcAdapter implements ITrxRpcAdapter {

    constructor(private readonly gateway: TrxRpcGateway) {
        console.log("TrxRpcAdapter initialized");
    }

    public async setTracker(tracker: Tracker): Promise<void> {
        try {
            const request: Request = {
                setTracker: { tracker }
            };
            await this.gateway.request(request);
        } catch {
            console.error("Error occurred while setting tracker:", tracker);
        }
    }
}
