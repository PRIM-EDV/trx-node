import { Global, Module } from '@nestjs/common';
import { TrackerApiService } from './tracker.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { TrackerRpcModule } from 'src/infrastructure/rpc/tracker/tracker.rpc.module';
@Global()
@Module({
    imports:[
        MapEntityModule,
        TrackerRpcModule
    ],
    providers: [
        TrackerApiService
    ],
    exports: [
        TrackerApiService
    ]
})
export class TrackerApiModule {
    
}