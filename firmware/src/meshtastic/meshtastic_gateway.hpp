/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef MESHTASTIC_GATEWAY_HPP
#define MESHTASTIC_GATEWAY_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include <modm/processing/timer.hpp>
#include <pb_encode.h>

#include "driver/cdebyte/e32-x00mx0s.hpp"
#include "lib/thread/thread.hpp"

#include "meshtastic_gateway_ipc.hpp"
#include "src/host/host_rpc_adapter.hpp"

using namespace modm;

template <typename SpiMaster, typename Cs, typename D0, typename RxEn, typename TxEn>
class MeshtasticGateway : public Thread<1024>
{
public:
    void
    initialize()
    {
        RF_CALL_BLOCKING(modem.setLora());
        RF_CALL_BLOCKING(modem.setCarrierFreq(0xd9, 0x5d, 0x9a)); // 869.465 MHz - FSTEP = 61.035 Hz
        RF_CALL_BLOCKING(modem.setHighFrequencyMode());
        RF_CALL_BLOCKING(modem.setLnaBoostHf());
        RF_CALL_BLOCKING(modem.setPaBoost());
        RF_CALL_BLOCKING(modem.setAgcAutoOn());
        RF_CALL_BLOCKING(modem.setExplicitHeaderMode()); // Meshtastic packets are variable length, so no implicit header
        RF_CALL_BLOCKING(modem.setSpreadingFactor(sx127x::SpreadingFactor::SF12));
        RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr250kHz));
        RF_CALL_BLOCKING(modem.enablePayloadCRC());
        RF_CALL_BLOCKING(modem.setDio0Mapping(0));

        // // Set output power to 10 dBm (boost mode)
        RF_CALL_BLOCKING(modem.setOutputPower(0x0f));
        RF_CALL_BLOCKING(modem.setOperationMode(sx127x::Mode::RecvCont));
    };

    bool
    run()
    {
        while (1)
        {
            PT_WAIT_UNTIL(packetAvailable() || MeshtasticGatewayIpc::commandQueue.isNotEmpty());

            if (packetAvailable())
            {
                handlePacket();
            }

            if (MeshtasticGatewayIpc::commandQueue.isNotEmpty())
            {
                handleIpc();
            };

        };
    };

    void
    handleIpc()
    {
        MeshtasticGatewayIpc::Command cmd = MeshtasticGatewayIpc::commandQueue.get();
        switch (cmd.kind)
        {
            case MeshtasticGatewayIpc::Cmd::SetModemConfig:
                setModemConfig(cmd.setModemConfig);
                break;
        }

        MeshtasticGatewayIpc::commandQueue.pop();
    }

    void
    setModemConfig(MeshtasticGatewayIpc::SetModemConfigArgs &config)
    {
        modem.setBandwidth(config.bandwidth);
        modem.setCarrierFreq((frequency_t)config.frequency);
        modem.setSpreadingFactor(config.spreadingFactor);
        modem.setCodingRate(config.codingRate);
    }

    void
    handlePacket()
    {
        uint8_t buffer[128];
        uint8_t length = 0;
        if (receivePacket(buffer, length))
        {
            // No parsing - forward the raw packet bytes to the host as-is
            HostRpcAdapter::processMeshtasticPayload(buffer, length);
        }
    }

    void
    sendPacket(uint8_t *data, uint8_t length)
    {
        modm::ShortTimeout timeout{2s};
        modem.sendPacket(data, length);
        RF_WAIT_UNTIL(packetSent() || timeout.isExpired());
        modem.write(sx127x::Address::IrqFlags, 0xff);
        modem.setOperationMode(sx127x::Mode::RecvCont);
    };

private:
    E32x00Mx0s<SpiMaster, Cs, RxEn, TxEn> modem;

    bool
    packetAvailable()
    {
        return D0::read();
    }

    bool
    packetSent()
    {
        return D0::read();
    }

    bool
    receivePacket(uint8_t *buffer, uint8_t &length)
    {
        uint8_t status[1];
        modem.read(sx127x::Address::IrqFlags, status, 1);

        if (!(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError))
        {
            uint8_t nbBytes[1];
            modem.read(sx127x::Address::RxNbBytes, nbBytes, 1);
            length = nbBytes[0] > 128 ? 128 : nbBytes[0];

            RF_CALL(modem.getPayload(buffer, length));
        }

        modem.write(sx127x::Address::IrqFlags, 0xff);
        return !(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError);
    };
};

#endif
