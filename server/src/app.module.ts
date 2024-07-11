import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './core/logging/logging.module';
import { SerialService } from './platform/serial/serial.service';

(global as any).WebSocket = require('ws');

@Module({
  imports: [LoggingModule],
  controllers: [AppController],
  providers: [AppService, SerialService],
})
export class AppModule {}
