import { Global, Module } from '@nestjs/common';
import { TrxRpcModule } from 'src/infrastructure/rpc/trx/trx.rpc.module';
import { MeshtasticApiController } from './meshtastic.api.controller';
import { MeshtasticModule } from 'src/core/meshtastic/meshtastic.module';
import { MeshtasticApiService } from './meshtastic.api.service';
import { MaptoolRpcModule } from 'src/infrastructure/rpc/maptool/maptool.rpc.module';
@Global()
@Module({
    imports:[
        MaptoolRpcModule,
        MeshtasticModule,
        TrxRpcModule
    ],
    providers: [
        MeshtasticApiService,
        MeshtasticApiController
    ],
    exports: [
        MeshtasticApiService,
        MeshtasticApiController
    ]
})
export class MeshtasticApiModule {
    
}