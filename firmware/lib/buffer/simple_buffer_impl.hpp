#include "simple_buffer.hpp"
/* Copyright (c) 2023, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

template <uint8_t N>
SimpleBuffer<N>::SimpleBuffer()
{
}

template <uint8_t N>
inline void SimpleBuffer<N>::clear()
{
    memset(data, 0, N);
    size = 0;
}

template <uint8_t N>
inline SimpleBuffer<N>&
SimpleBuffer<N>::operator+=(const char c)
{
    if(size < N) {
        data[size] = c;
        size++;
    }

    return *this;
}

template <uint8_t N>
SimpleBuffer<N>&
SimpleBuffer<N>::operator+=(const char *str)
{
    std::size_t len = std::min(std::strlen(str), (size_t) (N - size));
    std::strncpy(data[size], str, len);

    size += len;

    return *this;
}

template <uint8_t N>
uint8_t
SimpleBuffer<N>::maxSize()
{
    return N;
}
