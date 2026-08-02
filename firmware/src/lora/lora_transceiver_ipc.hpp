
#pragma once

#include <cstring>
#include "modm/architecture/driver/atomic/queue.hpp"

#include "trx.tracker.pb.hpp"

namespace LoraTransceiverIpc
{
    enum class Cmd : uint8_t { SendPacket };

    struct SendPacketArgs { uint8_t data[5]; };

    struct Command
    {
        Cmd kind;
        union {
            SendPacketArgs sendPacket;
        };
    };

    inline static modm::atomic::Queue<Command, 1> commandQueue;

    static void 
    sendPacket(uint8_t *data)
    {
        Command cmd;
        cmd.kind = Cmd::SendPacket;

        for (int i = 0; i < 5; ++i) {
            cmd.sendPacket.data[i] = data[i];
        }

        commandQueue.push(cmd);
    }
};