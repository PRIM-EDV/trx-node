import { Inject, Injectable } from "@nestjs/common";
import { User, Position, TAKPacket } from "@meshtastic/protocol";
import { WinstonLogger } from "@phobos/infrastructure";
import { TrackerDto_Type, TrackerDto } from "@phobos-maptool/protocol/dist/phobos.maptool.tracker";

import { MeshtasticService } from "src/core/meshtastic/meshtastic.service";
import { MeshtasticMapper } from "src/infrastructure/protocol/meshtastic/meshtastic.mapper";
import { TakService } from "src/core/tak/tak.service";
import { IMaptoolRpcAdapter } from "src/core/map-entity/interfaces/maptool.rpc.adapter.interface";

const MaptoolRpcAdapter = () => Inject('MaptoolRpcAdapter');

@Injectable()
export class MeshtasticApiService {
    constructor(
        private readonly logger: WinstonLogger,
        private readonly meshtastic: MeshtasticService,
        private readonly tak: TakService,
        @MaptoolRpcAdapter() private readonly maptoolRpcAdapter: IMaptoolRpcAdapter,
    ) {
        this.logger.setContext(MeshtasticApiService.name);
    }

    public async handlePosition(from: number, position: Position) {
        const node = await this.meshtastic.getNode(from);

        if (node != null) {
            const trackerDto: TrackerDto = {
                id: Number(node.id),
                position: MeshtasticMapper.toTrackerPosition(position),
                size: 0,
                type: TrackerDto_Type.TYPE_UNDEFINED
            }
            await this.maptoolRpcAdapter.setTracker(trackerDto);
        }
    }
    
    public async handleNodeInfo(from: number, nodeInfo: User) {
        await this.meshtastic.setNode(from, nodeInfo);
    }

    public async handleTakPacket(from: number, packet: TAKPacket) {
        const node = await this.meshtastic.getNode(from);
        // const trackerDto = this.tak.toTracker(packet);

        // if (trackerDto != null) {
        //     await this.maptoolRpcAdapter.setTracker(trackerDto);
        // }
    }
}