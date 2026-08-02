import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Tracker, Request } from "@trx/protocol";

import { TrxRpcGateway } from "./trx.rpc.gateway";
import { ITrxRpcAdapter } from "src/core/map-entity/interfaces/trx.rpc.adapter.interface";


@Injectable()
export class TrxRpcAdapter implements ITrxRpcAdapter {

    constructor(
        private readonly gateway: TrxRpcGateway,
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(TrxRpcAdapter.name);
        this.logger.log("TrxRpcAdapter initialized");
    }

    public async setTracker(tracker: Tracker): Promise<void> {
        try {
            const request: Request = {
                setTracker: { tracker }
            };
            await this.gateway.request(request);
        } catch {
            this.logger.error(`Error occurred while setting tracker: ${JSON.stringify(tracker)}`);
        }
    }
}
