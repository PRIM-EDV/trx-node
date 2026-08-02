
#pragma once

#include "modm/architecture/driver/atomic/queue.hpp"

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
    inline static modm::atomic::Queue<Command, 1> commandQueue;

    static void 
    request(Request& request)
    {
        Command cmd;
        cmd.kind = Cmd::Request;
        cmd.request.request = request;
        commandQueue.push(cmd);
    }
};