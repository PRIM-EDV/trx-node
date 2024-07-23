// ----------------------------------------------------------------------------
/* Copyright (c) 2023, Lucas Mösch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#include "board.hpp"

namespace Board
{

namespace zero
{
    modm::IODeviceWrapper<Uart, modm::IOBuffer::BlockIfFull> IODevice;
	modm::IOStream ioStream(IODevice);
}

}