import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { TrackerApiController } from './api/tracker/tracker.api.controller';
import { TrackerRpcGateway } from './infrastructure/rpc/tracker/tracker.rpc.gateway';
import { MapEntityRpcGateway } from './infrastructure/rpc/map-entity/map-entity.rpc.gateway';
import { TrackerApiModule } from './api/tracker/tracker.api.module';
import { MapEntityApiModule } from './api/map-entity/map-entity.api.module';
import { MapEntityApiService } from './api/map-entity/map-entity.api.service';

(global as any).WebSocket = require('ws');

@Global()
@Module({
  imports: [
    LoggingModule,
    TrackerApiModule,
    MapEntityApiModule,
  ],
  controllers: [AppController],
  providers: [
    MapEntityRpcGateway,
    TrackerRpcGateway
  ],
  exports: [
    MapEntityRpcGateway,
    TrackerRpcGateway
  ]
})
export class AppModule {
  constructor(
    private readonly mapEntityApi: MapEntityApiService,
    private readonly trackerApi: TrackerApiController
  ) {}
}
