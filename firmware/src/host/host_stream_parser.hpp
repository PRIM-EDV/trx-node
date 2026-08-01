/*
 * Copyright (c) 2026, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef HOST_STREAM_PARSER_HPP
#define HOST_STREAM_PARSER_HPP

#include <cstdint>
#include <modm/processing.hpp>

#include "board/board.hpp"

#include "lib/buffer/simple_buffer.hpp"
#include "lib/cobs/cobs.hpp"

using namespace Board;

enum class StreamParseStatus {
    Pending,          // Noch kein vollständiges Paket empfangen
    Success,          // Paket erfolgreich decodiert
    ErrorOverflow,    // Empfangenes Paket oder Zielpuffer zu klein
    ErrorDecode       // COBS-Decodierung fehlgeschlagen
};

// Strukturierter Rückgabetyp
struct StreamParseResult {
    StreamParseStatus status;
    std::size_t bytes_decoded{0};
};

class HostStreamParser
{
public:

    StreamParseResult
    read(uint8_t *data)
    {
        uint8_t c;

        if (zero::Uart::hasError())
        {
            zero::Uart::clearError();
            buffer.clear();
        }

        while (zero::Uart::read(c))
        {
            if (c == '\0')
            {
                uint8_t bytes_decoded = 0;
                if (buffer.size > 1)
                {
                    bytes_decoded = cobs_decode((uint8_t *)buffer.data, buffer.size, data);
                }
                buffer.clear();
                
                if (bytes_decoded > 0)
                {
                    return {StreamParseStatus::Success, bytes_decoded};
                }
            }
            else if (buffer.size >= buffer.maxSize())
            {
                buffer.clear();
                return {StreamParseStatus::ErrorOverflow, 0};
            }
            else
            {
                buffer += (char)c;
            }
        }
        
        return {StreamParseStatus::Pending, 0};
    }

private:
    SimpleBuffer<128> buffer;
};

#endif // HOST_STREAM_PARSER_HPP
