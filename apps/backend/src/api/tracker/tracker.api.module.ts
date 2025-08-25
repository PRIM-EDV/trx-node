import { Global, Module } from '@nestjs/common';
import { TrackerApiController } from './tracker.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { TrackerRpcModule } from 'src/infrastructure/rpc/tracker/tracker.rpc.module';
@Global()
@Module({
    imports:[
        MapEntityModule,
        TrackerRpcModule
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