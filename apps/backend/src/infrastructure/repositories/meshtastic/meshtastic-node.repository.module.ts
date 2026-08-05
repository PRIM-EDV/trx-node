import { Module } from '@nestjs/common';
import { MeshtasticNodeRepository } from './meshtastic-node.repository';

@Module({
    providers: [
        {
            provide: 'MeshtasticNodeRepository',
            useClass: MeshtasticNodeRepository
        }
    ],
    exports: [
        'MeshtasticNodeRepository'
    ]
})
export class MeshtasticNodeRepositoryModule {}
