import { Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { MapEntityApiService } from './map-entity.api.service';

@Module({
    imports: [
        MapEntityModule,
    ],
    providers: [
        MapEntityApiController,
        MapEntityApiService
    ],
})
export class MapEntityApiModule {
    
}