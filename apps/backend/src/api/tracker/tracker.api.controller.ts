import { Inject, Injectable } from "@nestjs/common";
import { WinstonLogger } from "@phobos/infrastructure";
import { Request, SetTracker_Request } from "@trx/protocol";

import { IMaptoolRpcAdapter } from "src/core/map-entity/interfaces/maptool.rpc.adapter.interface";
import { TrackerMapper } from "src/infrastructure/protocol/tracker/tracker.mapper.";
import { TrxRpcGateway } from "src/infrastructure/rpc/trx/trx.rpc.gateway";

const MaptoolRpcAdapter = () => Inject('MaptoolRpcAdapter');

@Injectable()
export class TrackerApiController {
  constructor(
    private readonly gateway: TrxRpcGateway,
    private readonly logger: WinstonLogger,
    @MaptoolRpcAdapter() private readonly maptoolRpcAdapter: IMaptoolRpcAdapter,
  ) {
    this.logger.setContext(TrackerApiController.name);
    this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
  }

  private async handleRequest({ msgId, request }: { msgId: string, request: Request }) {
    try {
      if (request.setTracker) {
        await this.handleSetTrackerRequest(request.setTracker);
      }
    } catch (error) {
       this.logger.error(`Failed to handle trx request: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Handles the SetTracker request by converting the tracker data to a TrackerDto and sending it to the maptool backend.
   */
  private async handleSetTrackerRequest(req: SetTracker_Request) {
    this.logger.debug(`Received Tracker packet from ${req.tracker?.id}: ${JSON.stringify(req.tracker)}`);
    if (req.tracker != null) {
      const tracker = req.tracker;
      const trackerDto = TrackerMapper.toTrackerDto(tracker);
      await this.maptoolRpcAdapter.setTracker(trackerDto);
    }
  }
}