import { Module } from '@nestjs/common';
import { TrackerRpcGateway } from './tracker.rpc.gateway';

@Module({
    providers: [
        TrackerRpcGateway,
    ],
    exports: [
        TrackerRpcGateway,
    ]
})
export class TrackerRpcModule {}