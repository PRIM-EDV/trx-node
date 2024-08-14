import { Module } from '@nestjs/common';
import { MapEntityService } from './map-entity.service';

@Module({
    providers: [MapEntityService],
})
export class MapEntityModule {
    
}