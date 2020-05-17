# Podio client written in Typescript

This module aims to provide a Podio client implementation for [Deno](https://deno.land/) and/or general Typescript programming

![test](https://github.com/open-zhy/podio-ts/workflows/test/badge.svg)

# Basic Usage
### Import
Most of public modules has been exported in `mod.ts`.
Some modules that are arbitrary have to be exported explicitly from its placement
```typescript
import { Client, PodioResponse, PodioError } from "https://deno.land/x/podio/mod.ts"
import { RuntimeStore } from "https://deno.land/x/podio/store/store_runtime.ts"
```

### Podio client setup and authentication
```typescript
const podio = new Client(
  "the-api-client",
  "the-client-secret-here",
  {
    // store can be left empty.
    // in that case, each authentication
    // process will attempt to retrieve token
    // directly from Podio, which can potentialy 
    // lead into some rate limit issue
    // RuntimeStore is a built-in storage, using Map data type
    // see https://github.com/open-zhy/podio-ts/blob/master/store/store_runtime.ts
    store: new RuntimeStore(),
  },
);

// authenticate client
const response = await podio.authenticate(
  "app",
  { app_id: 1234567, app_token: "a92239400b574cfca761cdf213a27975" },
);

const oAuthToken = response.asOAuthObject()
console.log({ oAuthToken })
```
After this process, an `OAuthObject` will be bound on the client instance, it will be used for any following requests which uses the same client instance


### Make request

```typescript
// simple GET request
const response = await podio.request("GET", `/app/1234567`);
if (response instanceof PodioResponse) {
  console.log(response.asObject()); // PodioObject data
}
```

We use native `fetch` and `Request` object to perform these client request. The 3rd options is passed through parameters for the native request object

```typescript
const response = await podio.request("PUT", `/item/123456789`, {
  body: {
    fields: {
      "title": "Hello Deno",
      "category-1": [1],
    }
  }
});
// response is either PodioError or PodioResponse
```

# Data objects
*(coming soon)*


# Events listeners
For now we can subscribe to 3 types of events emitted during each API call
-   **podio.request** - Executed when a request has been created and ready to fire, args: the `Request` object
-   **podio.response** - Fired once we get an healthy response from Podio, args: the `PodioResponse` object
-   **podio.error** - When a Podio error caught, args: `PodioError` object

#### Example
```typescript
// just right after client creation
// here we will just print information about Rate Limit contained in response headers
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
```


# Contribute? Welcome!!
Everyone is welcome to contribute to this project.
Therefore, here is some list of what I planned to implement in the future

-   **Tests** - Implement more test suite cases., just add *_test.ts file OR add more statement on existing ones
-   **Data Objects** - It would be good to have an abstraction of each type of data Podio can handle, here is the [complete references](https://developers.podio.com/doc)
-   **Session Manager** - Add common used session manager: filesystem, redis, in-memory db like [this](https://docs.rs/memdb/1.0.0/memdb/)
-   **Sandbox / Explorer** - Leverage simplicity of Deno to implement a sandox / explorer that can be used to test some API features