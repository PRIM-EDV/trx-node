/*
 * Copyright (c) 2026, Lucas Moesch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef MESSAGE_MODULE_HPP
#define MESSAGE_MODULE_HPP

#include "message_service.hpp"
#include "message_thread.hpp"

template <typename Uart>
class MessageModule
{
public:
    MessageModule() : worker_(service_) {}

    void
    initialize()
    {
        worker_.initialize();
    }

    MessageService&
    service()
    {
        return service_;
    }

    MessageThread<Uart>&
    worker()
    {
        return worker_;
    }

private:
    MessageService service_;
    MessageThread<Uart> worker_;
};

#endif // MESSAGE_MODULE_HPP
