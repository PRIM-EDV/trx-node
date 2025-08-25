/*
 * Copyright (c) 2024, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef CONTROL_THREAD_HPP
#define CONTROL_THREAD_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include <pb_decode.h>

#include "lib/buffer/message_buffer.hpp"
#include "protocol/trx.pb.hpp"  


using namespace modm;

template <typename Uart, typename Modem1, typename Modem2>
class ControlThread : public modm::pt::Protothread, private modm::NestedResumable<3>
{
public:
    ControlThread(Modem1 &modem1, Modem2 &modem2) : modem1(modem1), modem2(modem2) {};

    void
    initialize() {};

    bool
    run()
    {
        PT_BEGIN();
    
        uint8_t c;

        while (1)
        {
            PT_WAIT_UNTIL(Uart::read(c) || Uart::hasError());

            if (Uart::hasError())
            {
                Uart::clearError();
                message.clear();
            }
            else
            {
                do
                {
                    if (c == '\0')
                    {
                        PT_CALL(handleMessage());
                        message.clear();
                    } else {
                        message += (char)c;

                    }
                } while (Uart::read(c));
            }
        };

        PT_END();
    };

    ResumableResult<void>
    handleMessage() {
        uint8_t bytes_decoded;
        pb_istream_t stream;
        TrxMessage trxMessage = TrxMessage_init_zero;

        RF_BEGIN();

        bytes_decoded = cobs_decode((uint8_t*)message.data, message.size, decoded_buffer);
        stream = pb_istream_from_buffer(decoded_buffer, bytes_decoded);

        if (pb_decode(&stream, TrxMessage_fields, &trxMessage))
        {
            switch (trxMessage.which_message)
            {
                case TrxMessage_request_tag:
                    RF_CALL(handleRequest(trxMessage));
                case TrxMessage_response_tag:
                case TrxMessage_error_tag:
                    break;
                default:
                    break;
            }
        }

        RF_END();
    };

    ResumableResult<void>
    handleRequest(TrxMessage& trxMessage) {
        RF_BEGIN();

        switch (trxMessage.message.request.which_request)
        {
            case Request_setEntity_tag:
                Uart::write('a');
        // case Request_setMapEntity_tag:
        //     // RF_CALL(modem1.setMapEntity(trxMessage.message.request.request.setMapEntity.entity));
        //     break;
        
        default:
            break;
        }

        RF_END();
    }

private:
    MessageBuffer<128> message;
    Modem1 &modem1;
    Modem2 &modem2;

    uint8_t decoded_buffer[128];

};

#endif // CONTROL_THREAD_HPP