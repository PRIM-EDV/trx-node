import { Module } from '@nestjs/common';
import { MapEntityRpcGateway } from './map-entity.rpc.gateway';
import { MapEntityRpcAdapter } from './map-entity.rpc.adapter';

@Module({
    providers: [
        {
            provide: 'MapEntityRpcAdapter',
            useClass: MapEntityRpcAdapter 
        }
    ],
    exports: [
        {
            provide: 'MapEntityRpcAdapter',
            useClass: MapEntityRpcAdapter 
        }
    ]
})
export class MapEntityRpcModule {
    
}