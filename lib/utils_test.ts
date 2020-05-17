import { assertEquals, test } from "./testing.ts";
import * as u from "./utils.ts";
test({
  name: "utils.getValue",
  fn() {
    assertEquals(u.getValue({}, "test.0"), undefined);
    assertEquals(u.getValue({}, "test.0", 0), 0);
    assertEquals(
      u.getValue({ test: { very: { deep: 1 } } }, "test.very.deep", 0),
      1,
    );
    assertEquals(
      u.getValue(
        { test: { deep: { array: [1, 10, 20] } } },
        "test.deep.array.0",
        0,
      ),
      1,
    );
    assertEquals(
      u.getValue(
        { test: { deep: { array: [1, 10, 20] } } },
        "test.deep.array.2",
        0,
      ),
      20,
    );
  },
});
