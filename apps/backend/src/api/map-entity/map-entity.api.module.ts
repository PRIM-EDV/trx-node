import { Global, Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { MapEntityApiService } from './map-entity.api.service';
import { MaptoolRpcModule } from 'src/infrastructure/rpc/maptool/maptool.rpc.module';
@Global()
@Module({
    imports: [
        MapEntityModule,
        MaptoolRpcModule
    ],
    providers: [
        MapEntityApiController,
        MapEntityApiService
    ],
    exports: [
        MapEntityApiController,
        MapEntityApiService
    ]
})
export class MapEntityApiModule {
    
}