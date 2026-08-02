
#pragma once

#include "modm/architecture/driver/atomic/queue.hpp"

#include "driver/lora/semtec/sx127x/sx127x_definitions.hpp"

namespace MeshtasticGatewayIpc
{
    enum class Cmd : uint8_t { SetModemConfig };

    struct SetModemConfigArgs
    {
        modm::sx127x::SignalBandwidth bandwidth;
        uint32_t frequency;
        modm::sx127x::SpreadingFactor spreadingFactor;
        modm::sx127x::ErrorCodingRate codingRate;
    };

    struct Command
    {
        Cmd kind;
        union {
            SetModemConfigArgs setModemConfig;
        };
    };

    inline static modm::atomic::Queue<Command, 1> commandQueue;

    static void
    setModemConfig(modm::sx127x::SignalBandwidth bandwidth, uint32_t frequency,
                   modm::sx127x::SpreadingFactor spreadingFactor, modm::sx127x::ErrorCodingRate codingRate)
    {
        Command cmd;
        cmd.kind = Cmd::SetModemConfig;
        cmd.setModemConfig.bandwidth = bandwidth;
        cmd.setModemConfig.frequency = frequency;
        cmd.setModemConfig.spreadingFactor = spreadingFactor;
        cmd.setModemConfig.codingRate = codingRate;

        commandQueue.push(cmd);
    }
};
