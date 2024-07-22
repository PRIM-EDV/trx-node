/* Copyright (c) 2022, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef COBS_HPP
#define COBS_HPP


inline uint8_t cobs_encode(uint8_t *data, uint8_t nbBytes, uint8_t *buffer)
{
    uint8_t *codep = buffer; // Output code pointer
    uint8_t dist = 1; // Code value
    uint8_t bytes = nbBytes;
    buffer++;
    for (;bytes--; ++data)
    {
        if(*data) {
            *buffer = *data;
            buffer++;
            ++dist;
        } else {
            *codep = dist;
            dist = 1;
            codep = buffer;
            ++buffer;
        }
    }
    *codep = dist;

    return nbBytes + 1;
}

inline uint8_t cobs_decode()
{
    return 0;
}

#endif