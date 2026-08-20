#pragma once

#include "trx.tracker.pb.hpp"
#include "lora_packet.hpp"
#include "lora_transceiver_ipc.hpp"

class LoraRpcAdapter
{
public:

    static void
    setTracker(Tracker tracker)
    {
        lora_packet::Tracker packet{};
        packet.type = static_cast<lora_packet::Type>(tracker.type);
        packet.id = static_cast<uint8_t>(tracker.id);
        packet.size = static_cast<uint8_t>(tracker.size);
        packet.px = static_cast<uint16_t>(tracker.position.x);
        packet.py = static_cast<uint16_t>(tracker.position.y);

        uint8_t data[lora_packet::TRACKER_BYTES];
        packet.encode(data);

        LoraTransceiverIpc::sendPacket(data);
    }
};