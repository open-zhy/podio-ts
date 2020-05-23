import { PodioError } from "../lib/error.ts";
import { OAuthObject } from "../lib/oauth.d.ts";
import { EventHandler } from "../lib/event.ts";
import { StoreIO } from "../store/store.d.ts";
import { PodioResponse } from "../transport/response.ts";
import { RequestOptions } from "./request.d.ts";

export const HTTP_GET = "GET";
export const HTTP_POST = "POST";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";

export class ClientRequest {
  protected oAuth?: OAuthObject;
  protected store?: StoreIO;
  public event?: EventHandler;

  constructor(protected apiUrl: string, protected defaultHeaders = {}) {}

  /**
   * Bind the OAuth object on the client instance
   * 
   * @param oAuth 
   */
  async attachOAuth(oAuth: OAuthObject): Promise<any> {
    if (this.store) {
      await this.store.set(oAuth);
    }

    this.oAuth = oAuth;
  }

  /**
   * Build complete paths
   * 
   * @param path 
   */
  path(path: string, query: any = {}): string {
    const pathArr = [this.apiUrl];
    if (path.match(/^\//)) {
      pathArr.push(path.substr(1));
    } else {
      pathArr.push(path);
    }

    const search = new URLSearchParams(query);
    if (!search.entries().next().done) {
      return [pathArr.join("/"), search.toString()].join("?");
    }

    return pathArr.join("/");
  }

  /**
   * Map of Podio requests wether it needs an authentication or not
   * 
   * @param path 
   */
  needAuthorization(path: string): boolean {
    if (path.match(/^\/?oauth\/token/i)) {
      return false;
    }

    return true;
  }

  /**
   * Build a request object
   * 
   * @param method 
   * @param path 
   * @param options 
   */
  createRequest(
    method: string = HTTP_GET,
    path: string = "",
    options: RequestOptions = {},
  ): Request {
    const headers = Object.assign(
      {},
      this.defaultHeaders,
      options.headers || {},
    );

    if (
      this.needAuthorization(path) && typeof this.oAuth !== "undefined" &&
      !this.oAuth.isInvalid
    ) {
      // we check oAuth validity to avoid any expired_token error
      headers["Authorization"] = `OAuth2 ${this.oAuth.access_token}`;
    }

    switch (method) {
      case HTTP_POST:
        if (
          options.body &&
          headers["Content-Type"].match(/application\/json/)
        ) {
          options.body = JSON.stringify(options.body);
        } else if (
          options.body &&
          headers["Content-Type"].match(/application\/x\-www\-form\-urlencoded/)
        ) {
          options.body = (new URLSearchParams(options.body)).toString();
        }
        break;
    }

    return new Request(this.path(path), {
      ...options,
      headers: new Headers(headers),
      method,
    });
  }

  /**
   * Perform a request with all required headers and options
   * 
   * @param method 
   * @param path 
   * @param options 
   */
  async request(
    method: string,
    path: string,
    options = {},
  ): Promise<PodioError | PodioResponse> {
    const req = this.createRequest(method, path, options);
    this.event?.fire("podio.request", req);

    const { body, ...rsp } = await fetch(req).then(
      (r) => ({ ...r, body: r.json() }),
    );

    if (!body) {
      throw new Error("Invalid body response");
    }

    const b = await body;

    if (rsp.status === 200) {
      const response = new PodioResponse(b, rsp.headers);
      this.event?.fire("podio.response", response);
      if (path.match(/^\/oauth\/token/)) {
        await this.attachOAuth(b);
      }

      return response;
    }

    if (!rsp.ok) {
      const error = new PodioError(rsp.statusText, rsp.status, b);
      this.event?.fire("podio.error", error);

      return error;
    }

    return new Promise((_, reject) =>
      reject(
        new Error(
          `Unhandled podio response, status=${rsp.status}: ${rsp.statusText}`,
        ),
      )
    );
  }
}
