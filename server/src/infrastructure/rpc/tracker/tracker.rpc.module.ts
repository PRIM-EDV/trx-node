import { Module } from '@nestjs/common';
import { TrackerRpcGateway } from './tracker.rpc.gateway';
import { TrackerRpcAdapter } from './tracker.rpc.adapter';

@Module({
    providers: [
        TrackerRpcGateway,
        {
            provide: 'TrackerRpcAdapter',
            useClass: TrackerRpcAdapter 
        }
    ],
    exports: [
        TrackerRpcGateway,
        {
            provide: 'TrackerRpcAdapter',
            useClass: TrackerRpcAdapter 
        }
    ]
})
export class TrackerRpcModule {}