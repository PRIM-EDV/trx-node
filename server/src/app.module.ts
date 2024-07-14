import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggingModule } from './core/logging/logging.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    LoggingModule,
    ApiModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
