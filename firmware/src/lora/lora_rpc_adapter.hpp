#pragma once

#include "trx.tracker.pb.hpp"
#include "lora_transceiver_ipc.hpp"

class LoraRpcAdapter
{
public:

    static void
    setTracker(Tracker tracker)
    {
        uint8_t data[5];

        data[0] = ((tracker.type & 0x03) << 6) | (tracker.id & 0x3F);
        data[1] = ((tracker.size & 0x07) << 5) | 0x00;
        data[2] = ((tracker.position.x >> 4)) & 0xff;
        data[3] = ((tracker.position.x & 0x0F) << 4) | ((tracker.position.y >> 8) & 0x0F);
        data[4] = tracker.position.y & 0xff;
        
        LoraTransceiverIpc::sendPacket(data);
    }
};