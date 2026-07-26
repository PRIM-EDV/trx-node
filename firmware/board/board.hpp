// ----------------------------------------------------------------------------
/* Copyright (c) 2023, Lucas Moesch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#ifndef RLD_NODE_BOARD_HPP
#define RLD_NODE_BOARD_HPP

#include <modm/io.hpp>
#include <modm/platform.hpp>
#include <modm/architecture/interface/clock.hpp>

using namespace modm::platform;

namespace Board
{

using namespace modm::literals;

struct SystemClock
{
	// core and bus frequencys
	static constexpr uint32_t Hsi48 = 48_MHz;
	static constexpr uint32_t Frequency = Hsi48;
	static constexpr uint32_t Ahb = Frequency;
	static constexpr uint32_t Apb = Frequency;

	// Usart
	static constexpr uint32_t Usart1 = Apb;
	static constexpr uint32_t Usart2 = Apb;

	// Spi
	static constexpr int Spi1 = Frequency;
	static constexpr int Spi2 = Frequency;

    // Usb
    static constexpr uint32_t Usb = Ahb;

	static bool inline
    enable()
    {
        Rcc::enableLseCrystal();
		Rcc::enableHsi48Clock();

		Rcc::setFlashLatency<Frequency>();
		Rcc::updateCoreFrequency<Frequency>();

		Rcc::enableSystemClock(Rcc::SystemClockSource::Hsi48);
		Rcc::setRealTimeClockSource(Rcc::RealTimeClockSource::Lse);

        return true;
    }
};

namespace lora {
	using Sck = GpioOutputA5;
	using Miso = GpioInputA6;
	using Mosi = GpioOutputA7;

	using Spi = SpiMaster1;
}

namespace lora1 {
	using Nss = GpioOutputA12;
	using D0 = GpioInputA9;
    using TxEn = GpioOutputA10;
	using RxEn = GpioOutputA11;
}

namespace lora2 {
	using Nss = GpioOutputA8;
	using D0 = GpioInputB13;
	using TxEn = GpioOutputB14;
	using RxEn = GpioOutputB15;

	struct Hw
    {
        using SpiMaster = lora::Spi;
        using Cs        = Nss;
        using RxEn      = RxEn;
        using TxEn      = TxEn;
        using D0        = D0;
    };
}

namespace zero
{
	using Rx = GpioInputA3;
	using Tx = GpioOutputA2;

	using Uart = BufferedUart<UsartHal2, UartTxBuffer<128>, UartRxBuffer<128>>;
}


inline void
initialize()
{
	SystemClock::enable();
	SysTickTimer::initialize<SystemClock>();

    // Lora 1
	lora1::Nss::setOutput();
	lora1::RxEn::setOutput();
	lora1::TxEn::setOutput();

	lora1::RxEn::reset();
	lora1::TxEn::reset();
	lora1::Nss::set();

	// Lora 2
	lora2::Nss::setOutput();
	lora2::RxEn::setOutput();
	lora2::TxEn::setOutput();

	lora2::RxEn::reset();
	lora2::TxEn::reset();
	lora2::Nss::set();

    // Serial Lora
	lora::Spi::connect<lora::Sck::Sck, lora::Mosi::Mosi, lora::Miso::Miso>();
	lora::Spi::initialize<SystemClock, 6000000ul>();

	// Serial
	zero::Uart::connect<zero::Tx::Tx, zero::Rx::Rx>();
	zero::Uart::initialize<SystemClock, 9600_Bd>();
}

}

#include "board_impl.hpp"
#endif