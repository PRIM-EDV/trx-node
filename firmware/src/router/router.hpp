/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef ROUTER_HPP
#define ROUTER_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include "lib/thread/thread.hpp"


using namespace modm;

template <typename LoraTransceiver>
class Router : public Thread<512>
{
public:
    
    constexpr Router(LoraTransceiver& t) : lora(t) {}

    void
    initialize() {};

    bool
    run()
    {
        while (true) 
        {
            
        }
    }

private:
    LoraTransceiver& lora;
};

#endif // ROUTER_HPP