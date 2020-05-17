import {
  OAuthObject,
  GrantType,
  RefreshTokenAuthData,
  CodeAuthData,
  AppAuthData,
  PasswordAuthData,
} from "./lib/oauth.d.ts";
import { PodioError } from "./lib/error.ts";
import { PodioResponse } from "./transport/response.ts";

export interface ClientIO {
  /**
   * Bind an OAuth object onto the current client instance
   */
  attachOAuth: (oAuth: OAuthObject) => Promise<ClientIO>;

  /**
   * Perform authentication
   */
  authenticate: (
    grantType: GrantType,
    authData:
      | RefreshTokenAuthData
      | CodeAuthData
      | AppAuthData
      | PasswordAuthData,
  ) => Promise<PodioError | OAuthObject | PodioResponse>;

  /**
   * Perform request
   */
  request: (
    method: string,
    path: string,
    options: any,
  ) => Promise<PodioError | PodioResponse>;
}
