/*
 * Copyright (c) 2024, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef CONTROL_THREAD_HPP
#define CONTROL_THREAD_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

using namespace modm;

template <typename Modem1, typename Modem2>
class ControlThread : public modm::pt::Protothread, private modm::NestedResumable<3>
{
public:
    ControlThread(Modem1 &modem1, Modem2 &modem2) : modem1(modem1), modem2(modem2) {}

    void
    initialize() {};

    bool
    run()
    {
        PT_BEGIN();
        while (1)
        {
            // Do something
        };

        PT_END();
    };

private:
    Modem1 &modem1;
    Modem2 &modem2;
};

#endif // CONTROL_THREAD_HPP