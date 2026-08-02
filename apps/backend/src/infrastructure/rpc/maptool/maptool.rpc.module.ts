import { Module } from '@nestjs/common';
import { MaptoolRpcAdapter } from './maptool.rpc.adapter';

@Module({
    providers: [
        {
            provide: 'MaptoolRpcAdapter',
            useClass: MaptoolRpcAdapter
        }
    ],
    exports: [
        {
            provide: 'MaptoolRpcAdapter',
            useClass: MaptoolRpcAdapter
        }
    ]
})
export class MaptoolRpcModule {

}