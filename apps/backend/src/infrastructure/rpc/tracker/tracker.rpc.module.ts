import { Global, Module } from '@nestjs/common';
import { TrackerRpcAdapter } from './tracker.rpc.adapter';

@Module({
    providers: [
        {
            provide: 'TrackerRpcAdapter',
            useClass: TrackerRpcAdapter 
        }
    ],
    exports: [
        'TrackerRpcAdapter'
    ]
})
export class TrackerRpcModule {}