import { Global, Module } from '@nestjs/common';
import { TrackerApiController } from './tracker.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { TrxRpcModule } from 'src/infrastructure/rpc/trx/trx.rpc.module';
@Global()
@Module({
    imports:[
        MapEntityModule,
        TrxRpcModule
    ],
    providers: [
        TrackerApiController
    ],
    exports: [
        TrackerApiController
    ]
})
export class TrackerApiModule {
    
}