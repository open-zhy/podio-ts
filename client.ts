import { PodioError } from "./lib/error.ts";
import { ClientRequest, HTTP_POST } from "./transport/request.ts";
import { PodioResponse } from "./transport/response.ts";
import { EventHandler } from "./lib/event.ts";
import { ClientIO } from "./client.d.ts";
import {
  OAuthObject,
  GrantType,
  AuthDataRequest,
} from "./lib/oauth.d.ts";

const API_URL = "https://api.podio.com:443";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Agent": `podio-ts`,
};

export class Client extends ClientRequest implements ClientIO {
  protected clientId: string;
  protected clientSecret: string;

  constructor(clientId: string, clientSecret: string, options: any = {}) {
    super(API_URL, DEFAULT_HEADERS);
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.configure(options);
  }

  /**
   * Configure the client
   */
  configure(options: any): Client {
    const { store } = options;

    // setup event handler
    this.event = new EventHandler();

    // setup store for session management
    if (store) {
      this.store = store;
    }

    return this;
  }

  /**
   * Configure client with specific API credentials
   * 
   * @param clientId 
   * @param clientSecret 
   */
  configureWith(clientId: string, clientSecret: string, options: any): Client {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    return this.configure(
      Object.assign({ store: this.store, headers: DEFAULT_HEADERS }, options),
    );
  }

  /**
   * Perform API authentication
   * 
   * @param grantType 
   * @param authData 
   */
  async authenticate(
    grantType: GrantType,
    authData: AuthDataRequest,
  ): Promise<PodioError | OAuthObject | PodioResponse> {
    if (this.store) {
      const oauth = await this.store.get(grantType, authData);
      if (!oauth.isInvalid && oauth.access_token) {
        // check if not yet expired
        return new Promise((resolve) => resolve(oauth));
      }
    }

    return this.request(
      HTTP_POST,
      "/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          grant_type: grantType,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          ...authData,
        },
      },
    );
  }
}
