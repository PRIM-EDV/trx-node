/*
 * Copyright (c) 2023, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------
#ifndef SIMPLE_BUFFER_HPP
#define SIMPLE_BUFFER_HPP

#include <cstring>

template<uint8_t N>
class SimpleBuffer
{
public:
    char data[N + 1];
    uint8_t size;

    SimpleBuffer();

    void
    clear();

    SimpleBuffer& 
    operator+=(const char c);

    SimpleBuffer& 
    operator+=(const char* str);

    uint8_t
    maxSize();
};

#include "simple_buffer_impl.hpp"

#endif