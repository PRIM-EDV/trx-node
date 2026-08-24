/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef HOST_GATEWAY_HPP
#define HOST_GATEWAY_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "host_rpc_handler.hpp"
#include "lib/thread/thread.hpp"
#include "lib/uuid/uuid.h"

#include "host_gateway_ipc.hpp"
#include "host_stream_parser.hpp"

#include "pb_decode.h"
#include "pb_encode.h"
#include "trx.pb.hpp"

bool encode_string(pb_ostream_t *stream, const pb_field_t *field, void *const *arg)
{
    const char *str = (const char *)(*arg);

    if (!pb_encode_tag_for_field(stream, field))
        return false;

    return pb_encode_string(stream, (uint8_t *)str, strlen(str));
}

class HostGateway : public Thread<2048>
{
public:
    void
    initialize() {};

    bool
    run()
    {
        while (1)
        {
            StreamParseResult streamParseResult = streamParser.read(decoding_buffer);

            if (streamParseResult.status == StreamParseStatus::Success)
            {
                handleMessageFrame(decoding_buffer, streamParseResult.bytes_decoded);
            }

            if (HostGatewayIpc::commandQueue.isNotEmpty())
            {
                handleIpc();
            }

            modm::this_fiber::yield();
        }
    }

    void 
    request(Request& request)
    {
        TrxMessage trx_message = TrxMessage_init_zero;

        uuid::v4(trx_message.id);
        trx_message.which_message = TrxMessage_request_tag;
        trx_message.message.request = request;

        pb_ostream_t pb_ostream = pb_ostream_from_buffer(pb_stream_buffer, sizeof(pb_stream_buffer));
        pb_encode(&pb_ostream, TrxMessage_fields, &trx_message);
        uint8_t bytes_encoded = cobs_encode(pb_stream_buffer, pb_ostream.bytes_written, encoding_buffer);

        Board::zero::Uart::write(encoding_buffer, bytes_encoded);
        Board::zero::Uart::write('\0');
    }

    void 
    handleIpc()
    {
        Command cmd = HostGatewayIpc::commandQueue.get();
        switch (cmd.kind)
        {
            case Cmd::Request:
                request(cmd.request.request);
                break;
        }

        HostGatewayIpc::commandQueue.pop();
    }

private:
    HostStreamParser streamParser;
    uint8_t decoding_buffer[256];
    uint8_t encoding_buffer[256];
    uint8_t pb_stream_buffer[256];

    void handleMessageFrame(uint8_t *data, size_t length)
    {
        TrxMessage trx_message = TrxMessage_init_zero;
        pb_istream_t pb_istream = pb_istream_from_buffer(data, length);

        if (pb_decode(&pb_istream, TrxMessage_fields, &trx_message))
        {
            switch (trx_message.which_message)
            {
                case TrxMessage_response_tag:
                    break;
                case TrxMessage_request_tag:
                    HostRpcHandler::handleRequest(trx_message.message.request);
                    break;
            }
        } else
        {
            // handle error
        }
    }
};

#endif // HOST_GATEWAY_HPP