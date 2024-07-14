import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './core/logging/logging.module';
import { ApiModule } from './api/api.module';
import { WebsocketModule } from './core/websocket/websocket.module';

@Module({
  imports: [
    LoggingModule,
    ApiModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
