/*
 * Copyright (c) 2026, Lucas Moesch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef MESSAGE_THREAD_HPP
#define MESSAGE_THREAD_HPP

#include <string.h>

#include <pb_encode.h>

#include "lib/cobs/cobs.hpp"
#include "lib/thread/thread.hpp"
#include "lib/uuid/uuid.h"

#include "src/threads/message/message_service.hpp"

namespace
{
	bool
	encode_string(pb_ostream_t *stream, const pb_field_t *field, void *const *arg)
	{
		const char *str = (const char *)(*arg);

		if (!pb_encode_tag_for_field(stream, field))
		{
			return false;
		}

		return pb_encode_string(stream, (uint8_t *)str, strlen(str));
	}
}

template <typename Uart>
class MessageThread : public Thread
{
public:
	explicit MessageThread(MessageService &service) : service(service) {};

	void
	initialize() {};

	bool
	run() override
	{
		MessageThreadCommand command;
		if (service.tryTakeCommand(command))
		{
			handleCommand(command);
		}

		modm::this_fiber::yield();
		return true;
	}

private:
	void
	handleCommand(const MessageThreadCommand& command)
	{
		if (const auto *args = std::get_if<SetTrxTrackerArgs>(&command))
		{
			handleTrxTracker(args->trxEntity);
		}
		else if (const auto *args = std::get_if<SetMeshtasticTrackerArgs>(&command))
		{
			handleMeshtasticTracker(args->meshtastic);
		}
	}

	void
	handleTrxTracker(const Entity& entity)
	{
		uuid::v4(uuidBuffer);

		TrxMessage trxMessage = TrxMessage_init_zero;
		trxMessage.id.arg = uuidBuffer;
		trxMessage.id.funcs.encode = &encode_string;
		trxMessage.which_message = TrxMessage_request_tag;
		trxMessage.message.request.which_request = Request_setEntity_tag;
		trxMessage.message.request.request.setEntity = SetEntity_Request_init_default;
		trxMessage.message.request.request.setEntity.has_entity = true;
		trxMessage.message.request.request.setEntity.entity = entity;

		pb_ostream_t stream = pb_ostream_from_buffer(messageBuffer, sizeof(messageBuffer));
		if (!pb_encode(&stream, TrxMessage_fields, &trxMessage))
		{
			return;
		}

		uint8_t bytesEncoded = cobs_encode(messageBuffer, stream.bytes_written, encodingBuffer);
		Uart::write(encodingBuffer, bytesEncoded);
		Uart::write('\0');
	}

	void
	handleMeshtasticTracker(const MeshtasticTrackerData& data)
	{
		(void)data;
	}

private:
	MessageService& service;
	char uuidBuffer[38];
	uint8_t messageBuffer[128];
	uint8_t encodingBuffer[128];
};

#endif // MESSAGE_THREAD_HPP
