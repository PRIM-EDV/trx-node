import { Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';
import { TrackerModule } from 'src/core/tracker/tracker.module';

@Module({
    imports: [
        MapEntityModule,
        TrackerModule
    ],
    providers: [
        MapEntityApiController
    ],
})
export class MapEntityApiModule {
    
}