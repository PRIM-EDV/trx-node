/*
 * Copyright (c) 2022, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef LORA_TRANSCEIVER_HPP
#define LORA_TRANSCEIVER_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include <modm/processing/timer.hpp>

#include "lib/lora/lora_thread.hpp"

using namespace modm;

template <typename Hw>
class LoraTransceiver : public LoraThread<Hw, 5, 5>
{
public:
    void
    initialize()
    {
        RF_CALL_BLOCKING(this->modem.setLora());
        RF_CALL_BLOCKING(this->modem.setCarrierFreq(0xd9, 0x5d, 0x9a)); // 869.465 MHz - FSTEP = 61.035 Hz
        RF_CALL_BLOCKING(this->modem.setHighFrequencyMode());
        RF_CALL_BLOCKING(this->modem.setLnaBoostHf());
        RF_CALL_BLOCKING(this->modem.setPaBoost());
        RF_CALL_BLOCKING(this->modem.setAgcAutoOn());
        RF_CALL_BLOCKING(this->modem.setExplicitHeaderMode());
        RF_CALL_BLOCKING(this->modem.setSpreadingFactor(sx127x::SpreadingFactor::SF12));
        RF_CALL_BLOCKING(this->modem.setBandwidth(sx127x::SignalBandwidth::Fr250kHz));
        // RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr125kHz));
        // RF_CALL_BLOCKING(modem.setCodingRate(sx127x::ErrorCodingRate::Cr4_5));
        RF_CALL_BLOCKING(this->modem.enablePayloadCRC());
        RF_CALL_BLOCKING(this->modem.setPayloadLength(5));
        RF_CALL_BLOCKING(this->modem.setDio0Mapping(0));

        // // Set output power to 10 dBm (boost mode)
        RF_CALL_BLOCKING(this->modem.setOutputPower(0x0f));
        RF_CALL_BLOCKING(this->modem.setOperationMode(sx127x::Mode::RecvCont));

    };

protected:
    bool
    onRx() override
    {
        this->modem.read(sx127x::Address::IrqFlags, this->status, 1);
        if (!(this->status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError))
        {
            this->modem.getPayload(this->rxBuffer.data, 5);
        }
        this->modem.write(sx127x::Address::IrqFlags, 0xff);
        return !(this->status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError);
    }

    bool
    onTx() override
    {
        // timeout.restart(2000);
        this->modem.sendPacket(this->txBuffer.data, this->txBuffer.length);
        // RF_WAIT_UNTIL(messageSent() || timeout.isExpired());
        this->modem.write(sx127x::Address::IrqFlags, 0xff);
        this->modem.setOperationMode(sx127x::Mode::RecvCont);
        return true;
    }
private:
    // modm::ShortTimeout timeout;
};

#endif