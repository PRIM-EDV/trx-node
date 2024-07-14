import { Module } from '@nestjs/common';
import { MaptoolApiController } from './maptool.api.controller';

@Module({
    providers: [MaptoolApiController],
})
export class MapToolApiModule {
    
}