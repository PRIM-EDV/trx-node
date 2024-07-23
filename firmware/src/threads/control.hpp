/*
 * Copyright (c) 2024, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef CONTROL_THREAD_HPP
#define CONTROL_THREAD_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "lib/buffer/message_buffer.hpp"


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
                        // RF_CALL(parse());
                        message.clear();
                    } else {
                        message += (char)c;

                    }
                } while (Uart::read(c));
            }
        };

        PT_END();
    };

private:
    MessageBuffer<128> message;
    Modem1 &modem1;
    Modem2 &modem2;
};

#endif // CONTROL_THREAD_HPP