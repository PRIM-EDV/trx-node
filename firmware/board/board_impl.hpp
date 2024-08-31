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
    modm::IODeviceWrapper<Uart, modm::IOBuffer::DiscardIfFull> IODevice;
	modm::IOStream ioStream(IODevice);
}

}