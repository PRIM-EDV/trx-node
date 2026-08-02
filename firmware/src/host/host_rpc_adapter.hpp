#pragma once

#include "trx.pb.hpp"
#include "trx.tracker.pb.hpp"
#include "trx.meshtastic.pb.hpp"

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

    static void
    processMeshtasticPayload(uint8_t *data, uint8_t length)
    {
        Request request = Request_init_zero;
        request.which_request = Request_processMeshtasticPayload_tag;
        request.request.processMeshtasticPayload = ProcessMeshtasticPayload_Request_init_default;
        request.request.processMeshtasticPayload.has_packet = true;
        request.request.processMeshtasticPayload.packet = MeshtasticPacket_init_default;
        request.request.processMeshtasticPayload.packet.data.size = length;

        for (uint8_t i = 0; i < length; ++i) {
            request.request.processMeshtasticPayload.packet.data.bytes[i] = data[i];
        }

        HostGatewayIpc::request(request);
    }
};