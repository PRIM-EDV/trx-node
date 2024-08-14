import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { MapEntityRpcAdapterModule } from './infrastructure/rpc/map-entity/map-entity.rpc.adapter.module';
import { LoggingModule } from './infrastructure/logging/logging.module';

@Module({
  imports: [
    LoggingModule,
    ApiModule,
    MapEntityRpcAdapterModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
