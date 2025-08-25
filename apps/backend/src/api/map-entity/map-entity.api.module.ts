import { Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { MapEntityApiService } from './map-entity.api.service';
import { MapEntityRpcModule } from 'src/infrastructure/rpc/map-entity/map-entity.rpc.module';

@Module({
    imports: [
        MapEntityModule,
        MapEntityRpcModule
    ],
    providers: [
        MapEntityApiController,
        MapEntityApiService
    ],
})
export class MapEntityApiModule {
    
}