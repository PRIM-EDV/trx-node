#pragma once

#include "trx.pb.hpp"
#include "trx.tracker.pb.hpp"

#include "host_gateway_ipc.hpp"


class HostRpcAdapter
{
public:

    static void
    setTracker(Tracker tracker)
    {
        Request request = Request_init_zero;
        request.which_request = Request_setTracker_tag;
        request.request.setTracker = SetTracker_Request_init_default;
        request.request.setTracker.has_tracker = true;
        request.request.setTracker.tracker = tracker;
        
        HostGatewayIpc::request(request);
    }
};