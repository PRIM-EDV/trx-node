import { Module } from '@nestjs/common';
import { MapEntityApiModule } from './map-entity/map-entity.api.module';
import { TrackerApiModule } from './tracker/tracker.api.module';

@Module({
    imports: [
        MapEntityApiModule,
        TrackerApiModule
    ],
})
export class ApiModule {
    
}