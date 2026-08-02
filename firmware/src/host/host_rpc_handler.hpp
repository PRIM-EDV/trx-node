#pragma once

#include "trx.pb.hpp"

#include "src/lora/lora_rpc_adapter.hpp"
#include "src/meshtastic/meshtastic_rpc_adapter.hpp"

namespace HostRpcHandler
{
    inline void
    handleRequest(Request& request)
    {
        switch (request.which_request)
        {
            case Request_setTracker_tag:
                if (request.request.setTracker.has_tracker)
                {
                    LoraRpcAdapter::setTracker(request.request.setTracker.tracker);
                }
                break;
            case Request_setModemConfig_tag:
                if (request.request.setModemConfig.has_config)
                {
                    MeshtasticRpcAdapter::setModemConfig(request.request.setModemConfig.config);
                }
                break;
        }
    }
}