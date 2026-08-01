/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef HOST_GATEWAY_HPP
#define HOST_GATEWAY_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "lib/thread/thread.hpp"
#include "lib/uuid/uuid.h"

#include "host_gateway_ipc.hpp"
#include "host_stream_parser.hpp"

#include "pb_encode.h"
#include "trx.pb.hpp"

bool encode_string(pb_ostream_t *stream, const pb_field_t *field, void *const *arg)
{
    const char *str = (const char *)(*arg);

    if (!pb_encode_tag_for_field(stream, field))
        return false;

    return pb_encode_string(stream, (uint8_t *)str, strlen(str));
}

class HostGateway : public Thread<1024>
{
public:
    void
    initialize() {};

    bool
    run()
    {
        while (1)
        {

            // StreamParseResult streamParseResult = streamParser.read(decoding_buffer);
            modm::this_fiber::yield();
        }
    }

    void 
    request(Request& request)
    {
        // generate UUID
        uuid::v4(uuid_buffer); 

        TrxMessage trx_message = TrxMessage_init_zero;
        trx_message.id.arg = uuid_buffer;
        trx_message.id.funcs.encode = &encode_string;

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
        if (HostGatewayIpc::commandQueue.isNotEmpty())
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
    }

private:
    HostStreamParser streamParser;
    uint8_t decoding_buffer[128];
    uint8_t encoding_buffer[128];
    uint8_t pb_stream_buffer[128];
    char uuid_buffer[38];
};

#endif // HOST_GATEWAY_HPP