import { Module } from '@nestjs/common';
import { MapEntityApiController } from './map-entity.api.controller';

@Module({
    providers: [MapEntityApiController],
})
export class MapEntityApiModule {
    
}