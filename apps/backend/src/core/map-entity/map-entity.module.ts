import { Global, Module } from '@nestjs/common';
import { MapEntityService } from './map-entity.service';
import { MaptoolRpcModule } from 'src/infrastructure/rpc/maptool/maptool.rpc.module';
import { TrxRpcModule } from 'src/infrastructure/rpc/trx/trx.rpc.module';

@Global()
@Module({
    imports: [
        MaptoolRpcModule,
        TrxRpcModule
    ],
    providers: [MapEntityService],
    exports: [MapEntityService]
})
export class MapEntityModule {
    
}