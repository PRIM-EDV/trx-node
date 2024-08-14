import { Module } from '@nestjs/common';
import { MapEntityService } from './map-entity.service';

@Module({
    providers: [MapEntityService],
    exports: [MapEntityService]
})
export class MapEntityModule {
    
}