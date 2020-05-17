import { assert, assertEquals, test } from "./lib/testing.ts";
import { Client } from "./client.ts";

// prepare the API client
const podio = new Client("client_id", "api_secret");

test({
  name: "Main HTTP Client abstraction",
  fn() {
    assertEquals(
      podio.path("/oauth/token"),
      "https://api.podio.com:443/oauth/token",
    );
    assertEquals(
      podio.path("item/12345"),
      "https://api.podio.com:443/item/12345",
    );
  },
});
