/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef LORA_TRANSCEIVER_HPP
#define LORA_TRANSCEIVER_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include <modm/processing/timer.hpp>
#include <pb_encode.h>

#include "driver/cdebyte/e32-x00mx0s.hpp"
#include "lib/thread/thread.hpp"

#include "lora_transceiver_ipc.hpp"
#include "src/host/host_rpc_adapter.hpp"

using namespace modm;

template <typename SpiMaster, typename Cs, typename D0, typename RxEn, typename TxEn>
class LoraTransceiver : public Thread<512>
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
        RF_CALL_BLOCKING(modem.setExplicitHeaderMode());
        RF_CALL_BLOCKING(modem.setSpreadingFactor(sx127x::SpreadingFactor::SF12));
        RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr250kHz));
        // RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr125kHz));
        // RF_CALL_BLOCKING(modem.setCodingRate(sx127x::ErrorCodingRate::Cr4_5));
        RF_CALL_BLOCKING(modem.enablePayloadCRC());
        RF_CALL_BLOCKING(modem.setPayloadLength(5));
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
            PT_WAIT_UNTIL(packetAvailable() || LoraTransceiverIpc::commandQueue.isNotEmpty());

            if (packetAvailable())
            {
                handlePacket();
            } 

            if (LoraTransceiverIpc::commandQueue.isNotEmpty())
            {
                handleIpc();
            };

        };
    };

    void
    handleIpc()
    {
        LoraTransceiverIpc::Command cmd = LoraTransceiverIpc::commandQueue.get();
        switch (cmd.kind)       
        {
            case LoraTransceiverIpc::Cmd::SendPacket:
                sendPacket(cmd.sendPacket.data);
                break;
        }

        LoraTransceiverIpc::commandQueue.pop();
    }

    void
    handlePacket()
    {
        uint8_t buffer[5];
        if (receivePacket(buffer))
        {
            handleTracker(buffer);
        } else
        {
            //
        }
    }

    void
    sendPacket(uint8_t *data)
    {
        modm::ShortTimeout timeout{2s};
        modem.sendPacket(data, 5);
        RF_WAIT_UNTIL(packetSent() || timeout.isExpired());
        modem.write(sx127x::Address::IrqFlags, 0xff);
        modem.setOperationMode(sx127x::Mode::RecvCont);
    };

private:
    uint8_t data[8];
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
    receivePacket(uint8_t *buffer)
    {
        uint8_t status[1];
        modem.read(sx127x::Address::IrqFlags, status, 1);

        if (!(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError))
        {
            RF_CALL(modem.getPayload(buffer, 5));
        }

        modem.write(sx127x::Address::IrqFlags, 0xff);
        return !(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError);
    };

    void handleTracker(uint8_t *data)
    {
        Tracker tracker = Tracker_init_default;
        tracker.id = data[0] & 0x3F;
        tracker.has_position = true;
        tracker.position = Position_init_default;
        tracker.position.x = ((uint16_t)data[2] << 4) | ((data[3] >> 4) & 0x0F);
        tracker.position.y = ((uint16_t)(data[3] & 0x0F) << 8) |  data[4];
        tracker.type = parseType((data[0] >> 6) & 0x03);
        tracker.size = (data[1] >> 5) & 0x07;

        HostRpcAdapter::setTracker(tracker);
    }

    Type
    parseType(uint8_t byte)
    {
        switch (byte)
        {
            case 0x00:
                return Type_UNKNOWN;
            case 0x01:
                return Type_SQUAD;
            case 0x02:
                return Type_ENEMY;
            case 0x03:
                return Type_OBJECTIVE;
            default:
                return Type_UNKNOWN;
        }
    }
};

#endif