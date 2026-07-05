/*
 * Copyright (c) 2026, Lucas Moesch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef MESSAGE_THREAD_SERVICE_HPP
#define MESSAGE_THREAD_SERVICE_HPP

#include <stddef.h>
#include <stdint.h>
#include <variant>

#include <modm/architecture/driver/atomic/queue.hpp>

#include "message_interface.hpp"

struct SetTrxTrackerArgs { Entity trxEntity; };
struct SetMeshtasticTrackerArgs { MeshtasticTrackerData meshtastic; };
struct NoneArgs {};

using MessageThreadCommand = std::variant<NoneArgs, SetTrxTrackerArgs, SetMeshtasticTrackerArgs>;

class MessageService
{
public:
    static constexpr size_t QueueSize = 8;

    bool
    setTrxTracker(const Entity& entity) override
    {
        MessageThreadCommand command = SetTrxTrackerArgs{entity};
        return enqueue(command);
    }

    bool
    setMeshtasticTracker(const MeshtasticTrackerData& data) override
    {
        MessageThreadCommand command = SetMeshtasticTrackerArgs{data};
        return enqueue(command);
    }

private:
    bool
    enqueue(const MessageThreadCommand& command)
    {
        return queue.push(command);
    }

public:
    bool
    tryTakeCommand(MessageThreadCommand& out)
    {
        if (queue.isEmpty())
        {
            return false;
        }

        out = queue.get();
        queue.pop();
        return true;
    }

private:
    modm::atomic::Queue<MessageThreadCommand, QueueSize> queue;
};

#endif // MESSAGE_THREAD_SERVICE_HPP
