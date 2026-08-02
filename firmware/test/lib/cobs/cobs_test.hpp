#include <unittest/testsuite.hpp>
#include <unittest/harness.hpp>

#include "../../../lib/cobs/cobs.hpp"

class CobsTest : public unittest::TestSuite
{
public:
    void testEncode();
    void testEncodeInplace();
    void testDecode();
    void testDecodeInplace();
};

// Reference vector (see https://crccalc.com/bytestuffing.php), covering a
// leading zero, repeated non-zero bytes and a trailing zero:
// {0x00, 0x11, 0x11, 0x00, 0x22, 0x22, 0x00} <-> {0x01, 0x03, 0x11, 0x11, 0x03, 0x22, 0x22, 0x01}

inline void CobsTest::testEncode()
{
    uint8_t input[]    = {0x00, 0x11, 0x11, 0x00, 0x22, 0x22, 0x00};
    uint8_t expected[] = {0x01, 0x03, 0x11, 0x11, 0x03, 0x22, 0x22, 0x01};
    uint8_t encoded[sizeof(expected)] = {};

    uint8_t length = cobs_encode(input, sizeof(input), encoded);

    TEST_ASSERT_EQUALS(length, sizeof(expected));
    TEST_ASSERT_EQUALS_ARRAY(encoded, expected, sizeof(expected));
}

inline void CobsTest::testEncodeInplace()
{
    uint8_t buffer[]   = {0x00, 0x11, 0x11, 0x00, 0x22, 0x22, 0x00, 0x00};
    uint8_t expected[] = {0x01, 0x03, 0x11, 0x11, 0x03, 0x22, 0x22, 0x01};

    uint8_t length = cobs_encode_inplace(buffer, 7);

    TEST_ASSERT_EQUALS(length, sizeof(expected));
    TEST_ASSERT_EQUALS_ARRAY(buffer, expected, sizeof(expected));
}

inline void CobsTest::testDecode()
{
    uint8_t input[]    = {0x01, 0x03, 0x11, 0x11, 0x03, 0x22, 0x22, 0x01};
    uint8_t expected[] = {0x00, 0x11, 0x11, 0x00, 0x22, 0x22, 0x00};
    uint8_t decoded[8] = {};

    uint8_t length = cobs_decode(input, sizeof(input), decoded);

    TEST_ASSERT_EQUALS(length, sizeof(expected));
    TEST_ASSERT_EQUALS_ARRAY(decoded, expected, sizeof(expected));
}

inline void CobsTest::testDecodeInplace()
{
    uint8_t buffer[]   = {0x01, 0x03, 0x11, 0x11, 0x03, 0x22, 0x22, 0x01};
    uint8_t expected[] = {0x00, 0x11, 0x11, 0x00, 0x22, 0x22, 0x00};

    uint8_t length = cobs_decode_inplace(buffer, sizeof(buffer));

    TEST_ASSERT_EQUALS(length, sizeof(expected));
    TEST_ASSERT_EQUALS_ARRAY(buffer, expected, sizeof(expected));
}
