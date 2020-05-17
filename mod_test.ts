import { assert, assertEquals, test } from "./lib/testing.ts";
import * as mod from "./mod.ts";
test({
  name: "Basic/Public API assertions",
  fn() {
    assert(mod != null);
    assertEquals(typeof mod.Client, "function");
  },
});
