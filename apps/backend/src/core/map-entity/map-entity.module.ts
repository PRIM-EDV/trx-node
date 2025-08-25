import { Global, Module } from '@nestjs/common';
import { MapEntityService } from './map-entity.service';
import { MapEntityRpcModule } from 'src/infrastructure/rpc/map-entity/map-entity.rpc.module';
import { TrackerRpcModule } from 'src/infrastructure/rpc/tracker/tracker.rpc.module';

@Global()
@Module({
    imports: [
        MapEntityRpcModule,
        TrackerRpcModule
    ],
    providers: [MapEntityService],
    exports: [MapEntityService]
})
export class MapEntityModule {
    
}