import { Module } from '@nestjs/common';
import { TakService } from './tak.service';

@Module({
  providers: [TakService],
  exports: [TakService],
})
export class TakModule {}
