import jsonMixin from "../lib/output.ts";
import { PodioOAuthToken } from "../lib/oauth.ts";
import { PodioObject } from "../model/podio_object.ts";
import { PodioCollection } from "../model/podio_collection.ts";

/**
 * PodioResponse represents generally a valid HTTP
 * response from Podio API
 */
export class PodioResponse {
  headers?: Headers;

  // set all type of expected body responses
  public body: PodioCollection | PodioObject | PodioOAuthToken;

  constructor(
    body: PodioCollection | PodioObject | PodioOAuthToken,
    headers: Headers,
  ) {
    if (headers) {
      this.headers = headers;
    }

    this.body = body;
  }

  public asOAuthToken(): PodioOAuthToken {
    this.body = new PodioOAuthToken(this.body);
    return this.body;
  }

  public asCollection(): PodioCollection {
    this.body = new PodioCollection(this.body);
    return this.body;
  }

  public asObject(): PodioObject {
    this.body = new PodioObject(this.body);
    return this.body;
  }
}

// @TODO: fix mixin implementation for better dev pattern
Object.assign(PodioResponse.prototype, jsonMixin);
