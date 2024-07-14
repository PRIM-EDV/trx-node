import { Module } from '@nestjs/common';
import { MapToolApiModule } from './maptool/maptool.api.module';
import { TrackerApiModule } from './tracker/tracker.api.module';

@Module({
    imports: [
        MapToolApiModule,
        TrackerApiModule
    ],
})
export class ApiModule {
    
}