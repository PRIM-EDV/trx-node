/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef LORA_THREAD_HPP
#define LORA_THREAD_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include <modm/processing/timer.hpp>

#include "board/board.hpp"
#include "driver/cdebyte/e32-x00mx0s.hpp"
#include "lib/cobs/cobs.hpp"
#include "lib/uuid/uuid.h"
#include "lib/thread/thread.hpp"

#include "lora_message.hpp"

using namespace modm;

template <typename Hw, size_t RxBufferSize = 128, size_t TxBufferSize = 128>
class LoraThread : public Thread<1024>
{
public:
    virtual void
    initialize() = 0;

    bool
    run()
    {
        while (true)
        {
            PT_WAIT_UNTIL(rxMessageAvailable() || txMessageAvailable());

            if (rxMessageAvailable())
            {
                onRx();
            }else if (txMessageAvailable())
            {
                onTx();
            }
        };
    };

    bool
    send(uint8_t *data, size_t length)
    {
        if (txBuffer.length != 0)
        {
            return false;
        }

        memcpy(txBuffer.data, data, length);
        txBuffer.length = length;
        return true;
    };

    bool
    receive(uint8_t *data, size_t &length)
    {
        if (rxBuffer.length == 0)
        {
            return false;
        }

        memcpy(data, rxBuffer.data, rxBuffer.length);
        length = rxBuffer.length;

        rxBuffer = {};
        return true;
    };

protected:
    uint8_t status[1];
    LoraMessage<RxBufferSize> rxBuffer;
    LoraMessage<TxBufferSize> txBuffer;
    E32x00Mx0s<typename Hw::SpiMaster, typename Hw::Cs, typename Hw::RxEn, typename Hw::TxEn> modem;
    
    /**
     *  Reads a message from the LoRa transceiver.
     *
     *  Write the received message into the rxMessageBuffer and ...
     */
    virtual bool
    onRx() = 0;

    /**
     *  Sends a message via the LoRa transceiver.
     *
     *  Reads the message from the txMessageBuffer and sends it via the LoRa transceiver.
     */
    virtual bool
    onTx() = 0;

    bool
    txDone()
    {
        return Hw::D0::read();
    }

private:
    bool
    rxMessageAvailable()
    {
        return Hw::D0::read();
    }

    bool
    txMessageAvailable()
    {
        return txBuffer.length > 0;
    }
};

#endif