import { Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Tracker, Request, ModemConfig, bandwidthFromJSON, codingRateFromJSON } from "@trx/protocol";

import { readFileSync } from "fs";
import { join } from "path";

import { TrxRpcGateway } from "./trx.rpc.gateway";
import { ITrxRpcAdapter } from "src/core/map-entity/interfaces/trx.rpc.adapter.interface";

interface MeshtasticChannelSettingsFile {
    bandwidth: string;
    frequency: number;
    spreadingFactor: number;
    codingRate: string;
}

function loadMeshtasticChannelSettings(): ModemConfig {
    const raw = readFileSync(join(process.cwd(), "config", "meshtastic_channel_settings.json"), "utf-8");
    const config: MeshtasticChannelSettingsFile = JSON.parse(raw);

    return {
        bandwidth: bandwidthFromJSON(config.bandwidth),
        frequency: config.frequency,
        spreadingFactor: config.spreadingFactor,
        codingRate: codingRateFromJSON(config.codingRate),
    };
}

@Injectable()
export class TrxRpcAdapter implements ITrxRpcAdapter {

    constructor(
        private readonly gateway: TrxRpcGateway,
        private readonly logger: WinstonLogger,
    ) {
        this.logger.setContext(TrxRpcAdapter.name);
        this.logger.log("TrxRpcAdapter initialized");

        this.gateway.onOpen.subscribe(() => this.setModemConfig(loadMeshtasticChannelSettings()));
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

    public async setModemConfig(config: ModemConfig): Promise<void> {
        try {
            const request: Request = {
                setModemConfig: { config }
            };
            await this.gateway.request(request);
        } catch {
            this.logger.error(`Error occurred while setting modem config: ${JSON.stringify(config)}`);
        }
    }
}
