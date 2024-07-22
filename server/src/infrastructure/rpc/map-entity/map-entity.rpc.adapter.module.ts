import { Module } from '@nestjs/common';
import { MapEntityRpcGateway } from './map-entity.rpc.gateway';

@Module({
    providers: [MapEntityRpcGateway],
})
export class MapEntityRpcAdapterModule {
    
}