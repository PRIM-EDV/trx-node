import { Global, Inject, Module } from '@nestjs/common';
import { WinstonLogger, WinstonLoggerModule } from '@phobos/infrastructure';

import { AppController } from './app.controller';
import { TrackerApiController } from './api/tracker/tracker.api.controller';
import { TrxRpcGateway } from './infrastructure/rpc/trx/trx.rpc.gateway';
import { MaptoolRpcGateway } from './infrastructure/rpc/maptool/maptool.rpc.gateway';
import { TrackerApiModule } from './api/tracker/tracker.api.module';
import { MapEntityApiModule } from './api/map-entity/map-entity.api.module';
import { MapEntityApiService } from './api/map-entity/map-entity.api.service';
import { MeshtasticNodeRepositoryModule } from './infrastructure/repositories/meshtastic/meshtastic-node.repository.module';
import { IMeshtasticNodeRepository } from './core/meshtastic/interfaces/meshtastic-node.repository.interface';
import { MeshtasticApiModule } from './api/meshtastic/meshtastic.api.module';

(global as any).WebSocket = require('ws');

const MeshtasticNodeRepository = () => Inject('MeshtasticNodeRepository');

@Global()
@Module({
  imports: [
    WinstonLoggerModule,
    TrackerApiModule,
    MapEntityApiModule,
    MeshtasticApiModule,
    MeshtasticNodeRepositoryModule
  ],
  controllers: [AppController],
  providers: [
    MaptoolRpcGateway,
    TrxRpcGateway
  ],
  exports: [
    WinstonLoggerModule,
    MaptoolRpcGateway,
    TrxRpcGateway
  ]
})
export class AppModule {
  constructor(
    private readonly mapEntityApi: MapEntityApiService,
    private readonly trackerApi: TrackerApiController,
    private readonly logger: WinstonLogger,
     @MeshtasticNodeRepository() private readonly meshtasticNodeRepository: IMeshtasticNodeRepository,
  ) {
    this.logger.setContext(AppModule.name);
  }
}
