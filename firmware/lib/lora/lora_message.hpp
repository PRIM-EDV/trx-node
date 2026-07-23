template <size_t MaxLength>
struct LoraMessage
{
    uint8_t length = 0;
    uint8_t data[MaxLength] = {0};
};