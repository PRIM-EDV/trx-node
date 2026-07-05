/*
 * Copyright (c) 2026, Lucas Moesch
 * All Rights Reserved.
 */
// ----------------------------------------------------------------------------

#define FB_YIELD() \
	modm::this_fiber::yield()

#define FB_WAIT_WHILE(...) \
	while(__VA_ARGS__) { FB_YIELD(); }

#define FB_WAIT_UNTIL(...) \
	FB_WAIT_WHILE(!(__VA_ARGS__))