import { Global, Module } from '@nestjs/common';
import { WinstonLogger, WinstonLoggerModule } from '@phobos/infrastructure';

import { AppController } from './app.controller';
import { TrackerApiController } from './api/tracker/tracker.api.controller';
import { TrxRpcGateway } from './infrastructure/rpc/trx/trx.rpc.gateway';
import { MaptoolRpcGateway } from './infrastructure/rpc/maptool/maptool.rpc.gateway';
import { TrackerApiModule } from './api/tracker/tracker.api.module';
import { MapEntityApiModule } from './api/map-entity/map-entity.api.module';
import { MapEntityApiService } from './api/map-entity/map-entity.api.service';

(global as any).WebSocket = require('ws');

@Global()
@Module({
  imports: [
    WinstonLoggerModule,
    TrackerApiModule,
    MapEntityApiModule,
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
  ) {
    this.logger.setContext(AppModule.name);
  }
}
