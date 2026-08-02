#include <modm/processing.hpp>
#include <modm/processing/protothread.hpp>

#include "board/board.hpp"

#include "host/host_gateway.hpp"
#include "lora/lora_transceiver.hpp"
#include "meshtastic/meshtastic_gateway.hpp"


HostGateway host_gateway;
LoraTransceiver<lora::Spi, lora1::Nss, lora1::D0, lora1::RxEn, lora1::TxEn> lora_transceiver;
MeshtasticGateway<lora::Spi, lora2::Nss, lora2::D0, lora2::RxEn, lora2::TxEn> meshtastic_gateway;

int main()
{
    Board::initialize();

    host_gateway.initialize();
    lora_transceiver.initialize();
    meshtastic_gateway.initialize();

    modm::fiber::Scheduler::run();
}