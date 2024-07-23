#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "board/board.hpp"

#include "src/threads/lora.hpp"


using namespace Board;


namespace Board::lora1 {
    LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;
}

namespace Board::lora2 {
    LoraThread<lora::Spi, Nss, D0, RxEn, TxEn> thread;
}


int main()
{
    Board::initialize();
    fiber::Scheduler::run();
}