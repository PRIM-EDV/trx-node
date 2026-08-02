#pragma once

#include "trx.meshtastic.pb.hpp"
#include "meshtastic_gateway_ipc.hpp"

class MeshtasticRpcAdapter
{
public:

    static void
    setModemConfig(ModemConfig &config)
    {
        MeshtasticGatewayIpc::setModemConfig(
            mapBandwidth(config.bandwidth),
            config.frequency,
            mapSpreadingFactor(config.spreading_factor),
            mapCodingRate(config.coding_rate));
    }

private:

    static modm::sx127x::SignalBandwidth
    mapBandwidth(Bandwidth bandwidth)
    {
        switch (bandwidth)
        {
            case Bandwidth_BW_7_8KHZ:   return modm::sx127x::SignalBandwidth::Fr7_8kHz;
            case Bandwidth_BW_10_4KHZ:  return modm::sx127x::SignalBandwidth::Fr10_4kHz;
            case Bandwidth_BW_15_6KHZ:  return modm::sx127x::SignalBandwidth::Fr15_6kHz;
            case Bandwidth_BW_20_8KHZ:  return modm::sx127x::SignalBandwidth::Fr20_8kHz;
            case Bandwidth_BW_31_25KHZ: return modm::sx127x::SignalBandwidth::Fr31_25kHz;
            case Bandwidth_BW_41_7KHZ:  return modm::sx127x::SignalBandwidth::Fr41_7kHz;
            case Bandwidth_BW_62_5KHZ:  return modm::sx127x::SignalBandwidth::Fr62_5kHz;
            case Bandwidth_BW_125KHZ:   return modm::sx127x::SignalBandwidth::Fr125kHz;
            case Bandwidth_BW_500KHZ:   return modm::sx127x::SignalBandwidth::Fr500kHz;
            case Bandwidth_BW_250KHZ:
            case Bandwidth_BANDWIDTH_UNKNOWN:
            default:                    return modm::sx127x::SignalBandwidth::Fr250kHz;
        }
    }

    static modm::sx127x::ErrorCodingRate
    mapCodingRate(CodingRate codingRate)
    {
        switch (codingRate)
        {
            case CodingRate_CR_4_6:            return modm::sx127x::ErrorCodingRate::Cr4_6;
            case CodingRate_CR_4_7:            return modm::sx127x::ErrorCodingRate::Cr4_7;
            case CodingRate_CR_4_8:             return modm::sx127x::ErrorCodingRate::Cr4_8;
            case CodingRate_CR_4_5:
            case CodingRate_CODING_RATE_UNKNOWN:
            default:                           return modm::sx127x::ErrorCodingRate::Cr4_5;
        }
    }

    static modm::sx127x::SpreadingFactor
    mapSpreadingFactor(int32_t spreadingFactor)
    {
        if (spreadingFactor < 6) spreadingFactor = 6;
        if (spreadingFactor > 12) spreadingFactor = 12;

        return static_cast<modm::sx127x::SpreadingFactor>(spreadingFactor);
    }
};
