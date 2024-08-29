/*
 * Copyright (c) 2022, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef LORA_THREAD_HPP
#define LORA_THREAD_HPP

#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>
#include <modm/processing/timer.hpp>
#include <pb_encode.h>

#include "board/board.hpp"
#include "driver/cdebyte/e32-x00mx0s.hpp"
#include "lib/cobs/cobs.hpp"
#include "lib/uuid/uuid.h"

#include "protocol/trx.pb.hpp"

using namespace modm;

template <typename SpiMaster, typename Cs, typename D0, typename RxEn, typename TxEn>
class LoraThread : public modm::pt::Protothread, private modm::NestedResumable<3>
{
public:
    void
    initialize()
    {
        RF_CALL_BLOCKING(modem.setLora());
        RF_CALL_BLOCKING(modem.setCarrierFreq(0xd9, 0x5d, 0x9a)); // 869.465 MHz - FSTEP = 61.035 Hz
        RF_CALL_BLOCKING(modem.setHighFrequencyMode());
        RF_CALL_BLOCKING(modem.setLnaBoostHf());
        RF_CALL_BLOCKING(modem.setPaBoost());
        RF_CALL_BLOCKING(modem.setAgcAutoOn());
        RF_CALL_BLOCKING(modem.setExplicitHeaderMode());
        RF_CALL_BLOCKING(modem.setSpreadingFactor(sx127x::SpreadingFactor::SF12));
        RF_CALL_BLOCKING(modem.setBandwidth(sx127x::SignalBandwidth::Fr250kHz));
        // RF_CALL_BLOCKING(modem.setCodingRate(sx127x::ErrorCodingRate::Cr4_5));
        RF_CALL_BLOCKING(modem.enablePayloadCRC());
        RF_CALL_BLOCKING(modem.setPayloadLength(4));
        RF_CALL_BLOCKING(modem.setDio0Mapping(0));

        // // Set output power to 10 dBm (boost mode)
        RF_CALL_BLOCKING(modem.setOutputPower(0x0f));
        RF_CALL_BLOCKING(modem.setOperationMode(sx127x::Mode::RecvCont));

        timeout.restart(10s);
    };

    bool
    run()
    {
        PT_BEGIN();

        data[0] = data[1] = data[2] = data[3] = 0;

        while (1)
        {
            PT_WAIT_UNTIL(messageAvailable());

            if (messageAvailable())
            {
                RF_CALL(receiveMessage(data));
            }
        };

        PT_END();
    };

    ResumableResult<void>
    receiveMessage(uint8_t *buffer)
    {
        RF_BEGIN();

        RF_CALL(modem.read(sx127x::Address::IrqFlags, status, 1));
        if (!(status[0] & (uint8_t)sx127x::RegIrqFlags::PayloadCrcError))
        {
            RF_CALL(modem.getPayload(buffer, 4));
        }
        RF_CALL(modem.write(sx127x::Address::IrqFlags, 0xff));

        RF_END();
    };

    ResumableResult<uint8_t>
    sendMessage(uint8_t *data)
    {
        RF_BEGIN();

        RF_CALL(modem.setPayloadLength(4));
        RF_CALL(modem.sendPacket(data, 4));
        RF_WAIT_UNTIL(messageSent());
        RF_CALL(modem.write(sx127x::Address::IrqFlags, 0xff));
        RF_CALL(modem.setOperationMode(sx127x::Mode::RecvCont));

        RF_END_RETURN(0);
    };

    ResumableResult<uint8_t>
    setMapEntity(MapEntity mapEntity)
    {
        RF_BEGIN();

        data[0] = mapEntity.entity.squad.trackerId;
        data[1] = (mapEntity.position.x >> 6) & 0x0F;
        data[2] = (mapEntity.position.x << 2) | ((mapEntity.position.y >> 8) & 0x03);
        data[3] = (mapEntity.position.y) & 0xFF;

        RF_CALL(sendMessage(data));

        RF_END_RETURN(0);
    };

private:
    uint8_t data[8];
    uint8_t status[1];
    uint8_t message_bufer[128];
    uint8_t encoding_buffer[128];

    ShortTimeout timeout;
    E32x00Mx0s<SpiMaster, Cs, RxEn, TxEn> modem;

    bool encode_string(pb_ostream_t *stream, const pb_field_t *field, void *const *arg)
    {
        const char *str = (const char *)(*arg);

        if (!pb_encode_tag_for_field(stream, field))
            return false;

        return pb_encode_string(stream, (uint8_t *)str, strlen(str));
    }

    bool
    messageAvailable()
    {
        return D0::read();
    }

    bool
    messageSent()
    {
        return D0::read();
    }

    void setTracker(uint8_t *data)
    {
        // generate protobuf message
        Tracker tracker = Tracker_init_default;
        tracker.id = data[0];
        tracker.has_position = true;
        tracker.position = Tracker_Position_init_default;
        tracker.position.x = ((data[1] & 0x0f) << 6) | ((data[2] & 0xfc) >> 2);
        tracker.position.y = ((data[2] & 0x03) << 8) | data[3];

        TrxMessage trx_message = TrxMessage_init_default;
        uuid::v4(trx_message.id.arg);
        trx_message.id.funcs.encode = encode_string;

        trx_message.which_message = TrxMessage_request_tag;
        trx_message.message.request.which_request = Request_setTracker_tag;
        trx_message.message.request.request.setTracker.has_tracker = true;
        trx_message.message.request.request.setTracker = tracker;

        pb_ostream_t pb_ostream = pb_ostream_from_buffer(message_bufer, sizeof(message_bufer));
        pb_encode(&pb_ostream, TrxMessage_fields, &trx_message);
        uint8_t bytes_encoded = cobs_encode(message_bufer, pb_ostream.bytes_written, encoding_buffer);

        Board::zero::Uart::write(encoding_buffer, bytes_encoded);
        Board::zero::Uart::write('\0');
    }
};

#endif