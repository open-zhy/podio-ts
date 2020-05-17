import { Client } from "../client.ts";
import { RuntimeStore } from "../store/store_runtime.ts";
import { PodioResponse } from "../transport/response.ts";

(async () => {
  // create client
  const podio = new Client(
    "podio-client",
    "xxxxxxxxxxxxxxxx",
    {
      store: new RuntimeStore(),
    },
  );

  podio.event?.on("podio.response", (response: PodioResponse) => {
    response.headers?.forEach(
      (value, key) => {
        if (
          [
            "x-rate-limit-remaining",
            "x-rate-limit-limit",
            "x-podio-auth-ref",
          ].indexOf(key) >= 0
        ) {
          console.log(`--> ${key}=${value}`);
        }
      },
    );
  });

  // authenticate client
  const response = await podio.authenticate(
    "app",
    { app_id: 123456789, app_token: "a92239400b574cfca761cdf213a27975" },
  );

  if (response instanceof PodioResponse) {
    // do request
    const oAuthToken = response.asOAuthToken();
    console.log({ oAuthToken });

    const app = await podio.request("GET", `/app/19327262`);
    if (app instanceof PodioResponse) {
      console.log(app.asObject());
    }

    const items = await podio.request("POST", `/item/app/123456789/filter`);
    if (items instanceof PodioResponse) {
      console.log(items.asCollection());
    }
  } else {
    console.error("authentication error:", response);
    return;
  }
})();
