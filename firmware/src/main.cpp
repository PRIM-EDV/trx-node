#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "board/board.hpp"
#include "lora/lora_transceiver.hpp"
#include "router/router.hpp"

// #include "src/threads/lora.hpp"
// #include "src/threads/control.hpp"


using namespace Board;
// namespace Board::lora1 {
//     LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;
// }

namespace Board::lora2 {
    LoraTransceiver<lora2::Hw> transceiver;
    // LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;

    
}

namespace Board::control {
    // ControlThread<zero::Uart, decltype(lora2::thread)> thread(lora2::thread);
    // ControlThread<zero::Uart> thread;
}

Router<decltype(lora2::transceiver)> router(lora2::transceiver);

int main()
{
    Board::initialize();
    // lora2::thread.stack_watermark();
    // control::thread.stack_watermark();

    // lora1::thread.initialize();
    // lora2::thread.initialize();
    // control::thread.initialize();

    fiber::Scheduler::run();
}