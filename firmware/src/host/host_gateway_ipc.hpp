
#pragma once

#include "modm/architecture/driver/atomic/queue.hpp"
#include "modm/processing/fiber/scheduler.hpp"

#include "trx.pb.hpp"

enum class Cmd : uint8_t { Request };

struct RequestArgs { Request  request; };

struct Command
{
    Cmd kind;
    union {
        RequestArgs request;
    };
};

class HostGatewayIpc 
{
public:
    static modm::atomic::Queue<Command, 1> commandQueue;

    static void 
    request(Request& request)
    {
        Command cmd;
        cmd.kind = Cmd::Request;
        cmd.request.request = request;

        while (!commandQueue.push(cmd))
        {
            modm::this_fiber::yield();
        }
    }
};