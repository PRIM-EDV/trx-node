import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './logging/logging.module';
import { SerialService } from './serial/serial.service';
import { WebsocketService } from './websocket/websocket.service';

(global as any).WebSocket = require('ws');

@Module({
  imports: [LoggingModule],
  controllers: [AppController],
  providers: [AppService, SerialService, WebsocketService],
})
export class AppModule {}
