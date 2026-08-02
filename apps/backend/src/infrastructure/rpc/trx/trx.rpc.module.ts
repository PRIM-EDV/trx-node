import { Global, Module } from '@nestjs/common';
import { TrxRpcAdapter } from './trx.rpc.adapter';

@Module({
    providers: [
        {
            provide: 'TrxRpcAdapter',
            useClass: TrxRpcAdapter
        }
    ],
    exports: [
        'TrxRpcAdapter'
    ]
})
export class TrxRpcModule {}