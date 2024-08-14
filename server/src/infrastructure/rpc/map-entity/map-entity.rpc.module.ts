import { Module } from '@nestjs/common';
import { MapEntityRpcGateway } from './map-entity.rpc.gateway';
import { MapEntityRpcAdapter } from './map-entity.rpc.adapter';

@Module({
    providers: [
        MapEntityRpcGateway,
        {
            provide: 'MapEntityRpcAdapter',
            useClass: MapEntityRpcAdapter 
        }
    ],
    exports: [
        MapEntityRpcGateway,
        {
            provide: 'MapEntityRpcAdapter',
            useClass: MapEntityRpcAdapter 
        }
    ]
})
export class MapEntityRpcModule {
    
}