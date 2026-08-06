import { Module } from '@nestjs/common';
import { MeshtasticService } from './meshtastic.service';
import { MeshtasticNodeRepositoryModule } from 'src/infrastructure/repositories/meshtastic/meshtastic-node.repository.module';

@Module({
  imports: [
    MeshtasticNodeRepositoryModule  
  ],
  providers: [MeshtasticService],
  exports: [MeshtasticService],
})
export class MeshtasticModule {}

