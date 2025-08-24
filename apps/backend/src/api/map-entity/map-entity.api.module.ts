import { Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';

@Module({
    imports: [
        MapEntityModule,
    ],
    providers: [
        MapEntityApiController
    ],
})
export class MapEntityApiModule {
    
}