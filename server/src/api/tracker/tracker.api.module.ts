import { Module } from '@nestjs/common';
import { TrackerApiService } from './tracker.api.controller';
import { MapEntityModule } from 'src/core/map-entity/map-entity.module';

@Module({
    imports:[
        MapEntityModule,
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