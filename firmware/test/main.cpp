#include <unittest/reporter.hpp>
#include <modm/driver/io/terminal.hpp>

modm::Terminal outputDevice;
namespace unittest
{
	Reporter reporter(outputDevice);
}

int main()
{
	extern int run_modm_unit_test();
	return run_modm_unit_test();
}
