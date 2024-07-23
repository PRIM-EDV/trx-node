#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "board/board.hpp"

#include "src/threads/lora.hpp"
#include "src/threads/control.hpp"


using namespace Board;


namespace Board::lora1 {
    LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;
}

namespace Board::lora2 {
    LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;
}

namespace Board::control {
    ControlThread<decltype(lora1::thread), decltype(lora2::thread)> thread(lora1::thread, lora2::thread);
}


int main()
{
    Board::initialize();

    lora1::thread.initialize();
    lora2::thread.initialize();
    control::thread.initialize();

    fiber::Scheduler::run();
}