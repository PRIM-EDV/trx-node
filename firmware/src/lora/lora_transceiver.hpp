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
#include "lora_packet.hpp"

#include "lora_transceiver_ipc.hpp"
#include "src/host/host_rpc_adapter.hpp"

using namespace modm;

template <typename SpiMaster, typename Cs, typename D0, typename RxEn, typename TxEn>
class LoraTransceiver : public Thread<2048>
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
        RF_CALL_BLOCKING(modem.setImplicitHeaderMode());


        RF_CALL_BLOCKING(modem.setSpreadingFactor(sx127x::SpreadingFactor::SF12));
        RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr250kHz));
        RF_CALL_BLOCKING(modem.setCodingRate(sx127x::ErrorCodingRate::Cr4_8));
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
            modem.getPayload(buffer, 4);
        } else {
            HostRpcAdapter::log(LogLevel::LogLevel_LOG_LEVEL_WARN, "LoraTransceiver: CRC error in received packet");
        }

        modem.write(sx127x::Address::IrqFlags, 0xff);
        return !(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError);
    };

    void handleTracker(uint8_t *data)
    {
        lora_packet::Tracker decoded = lora_packet::Tracker::decode(data);

        Tracker tracker = Tracker_init_default;
        tracker.id = decoded.id;
        tracker.size = decoded.size;
        tracker.has_position = true;
        tracker.position = Position_init_default;
        tracker.position.x = decoded.px;
        tracker.position.y = decoded.py;
        tracker.type = static_cast<Type>(decoded.type);

        HostRpcAdapter::setTracker(tracker);
    }

};

#endif