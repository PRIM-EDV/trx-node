#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "board/board.hpp"

#include "host/host_gateway.hpp"
#include "lora/lora_transceiver.hpp"


HostGateway host_gateway;
LoraTransceiver<lora::Spi, lora1::Nss, lora1::D0, lora1::RxEn, lora1::TxEn> lora_transceiver;

int main()
{
    Board::initialize();

    host_gateway.initialize();
    lora_transceiver.initialize();

    modm::fiber::Scheduler::run();
}