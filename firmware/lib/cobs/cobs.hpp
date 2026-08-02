/* Copyright (c) 2022, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef COBS_HPP
#define COBS_HPP

#include <stdint.h>

inline uint8_t cobs_encode(uint8_t *data, uint8_t nbBytes, uint8_t *buffer)
{
    uint8_t *codep = buffer; // Output code pointer
    uint8_t dist = 1;        // Code value
    uint8_t bytes = nbBytes;
    buffer++;
    for (; bytes--; ++data)
    {
        if (*data)
        {
            *buffer = *data;
            buffer++;
            ++dist;
        }
        else
        {
            *codep = dist;
            dist = 1;
            codep = buffer;
            ++buffer;
        }
    }
    *codep = dist;

    return nbBytes + 1;
}

inline uint8_t cobs_decode(uint8_t *data, uint8_t nbBytes, uint8_t *buffer)
{
    uint8_t *codep = buffer; // Output code pointer
    uint8_t *data_end = data + nbBytes;

    for (uint8_t code = 0xff, block = 0; data < data_end; --block)
	{
        if (block) {
            *codep++ = *data++;
        } else {
            block = *data++;

            if(block && (code != 0xff)) {
                *codep++ = 0;
            }
            code = block;
            if (!code) {
                break;
            }
        }
    }
    
    return codep - buffer;
}

inline uint8_t cobs_encode_inplace(uint8_t *buffer, uint8_t nbBytes)
{
    uint8_t dist = 1;

    for (uint8_t i = nbBytes; i-- > 0;)
    {
        uint8_t byte = buffer[i];
        buffer[i + 1] = byte ? byte : dist;
        dist = byte ? dist + 1 : 1;
    }
    buffer[0] = dist;

    return nbBytes + 1;
}


inline uint8_t cobs_decode_inplace(uint8_t *buffer, uint8_t nbBytes)
{
    uint8_t *codep = buffer;
    uint8_t *data = buffer;
    uint8_t *data_end = buffer + nbBytes;

    for (uint8_t code = 0xff, block = 0; data < data_end; --block)
    {
        if (block) {
            *codep++ = *data++;
        } else {
            block = *data++;

            if(block && (code != 0xff)) {
                *codep++ = 0;
            }
            code = block;
            if (!code) {
                break;
            }
        }
    }

    return codep - buffer;
}

#endif