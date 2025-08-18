import { Module } from '@nestjs/common';
import { TrackerRpcAdapter } from './tracker.rpc.adapter';

@Module({
    providers: [
        TrackerRpcAdapter,
        {
            provide: 'TrackerRpcAdapter',
            useClass: TrackerRpcAdapter 
        }
    ],
    exports: [
        TrackerRpcAdapter,
        {
            provide: 'TrackerRpcAdapter',
            useClass: TrackerRpcAdapter 
        }
    ]
})
export class TrackerRpcModule {}