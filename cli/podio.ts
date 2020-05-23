#!/usr/bin/env -S deno run --allow-net
// Only on development environment
import {
  args,
  EarlyExitFlag,
  PartialOption,
  Option,
  ValueTypeText,
} from "../deps.ts";
import { VERSION } from "../mod.ts";
import { Client } from "../client.ts";
import { AuthDataRequest, GrantType } from "../lib/oauth.d.ts";
import { RuntimeStore } from "../store/store_runtime.ts";
import { PodioError } from "../lib/error.ts";

const parser = args
  .describe("Perform Podio request from command-line")
  .with(
    EarlyExitFlag("help", {
      describe: "Show help",
      exit() {
        console.log(parser.help());
        return Deno.exit();
      },
    }),
  )
  .with(
    EarlyExitFlag("version", {
      describe: "Show version",
      exit() {
        console.log(`cli/podio.ts version ${VERSION}`);
        return Deno.exit();
      },
    }),
  )
  .with(
    Option("clientId", {
      alias: ["c"],
      type: ValueTypeText,
      describe: "The Podio API client_id",
    }),
  )
  .with(
    Option("secret", {
      type: ValueTypeText,
      describe: "The Podio API client_secret",
    }),
  )
  .with(
    PartialOption("auth", {
      type: ValueTypeText,
      describe:
        "Authentication parameters {grant_type, ...}. If omitted, no authentication will be performed",
      default: "{}",
    }),
  )
  .with(
    PartialOption("body", {
      alias: ["d"],
      type: ValueTypeText,
      describe:
        "Authentication parameters {grant_type, ...}. If omitted, no authentication will be performed",
      default: null,
    }),
  );

const res = parser.parse(Deno.args);

if (res.error) {
  console.error("Failed to parse cli/podio.ts arguments");
  console.error(res.error.toString());
  Deno.exit(1);
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type AuthPayload = {
  grant_type: GrantType;
};
type PodioRequest = [RequestMethod, string, (string | object | null)?];

const { clientId, secret, body } = res.value;
const [method, requestUri] = res._;
(async (
  clientId,
  clientSecret,
  auth: AuthPayload,
  request: PodioRequest,
) => {
  if (!auth) {
    console.log("failed to parse authentication data");
    Deno.exit(1);
  }

  const podio = new Client(
    clientId,
    clientSecret,
    {
      store: new RuntimeStore(),
    },
  );

  // authenticate client
  const { grant_type, ...authPayload } = auth;
  let response = await podio.authenticate(
    grant_type,
    authPayload as AuthDataRequest,
  );

  if (response instanceof PodioError) {
    console.error("failed to authenticate into Podio", response);
    Deno.exit(1);
  }

  // prepare body if needed
  if (body && ["POST", "PUT"].indexOf(request[0]) >= 0) {
    request[2] = {
      body: JSON.parse(body),
    };
  }

  // execute the request
  response = await podio.request.apply(podio, <any> request);
  console.log(JSON.stringify(response));
})(
  clientId,
  secret,
  JSON.parse(res.value.auth),
  [method as RequestMethod, requestUri, body],
);
