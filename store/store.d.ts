import {
  OAuthObject,
  GrantType,
  RefreshTokenAuthData,
  CodeAuthData,
  AppAuthData,
  PasswordAuthData,
} from "../lib/oauth.d.ts";

export type KeyGetFunction = (
  grantType?: GrantType,
  authData?:
    | RefreshTokenAuthData
    | CodeAuthData
    | AppAuthData
    | PasswordAuthData,
) => string;
export type StoreGetFunction = (
  grantType?: GrantType,
  authData?:
    | RefreshTokenAuthData
    | CodeAuthData
    | AppAuthData
    | PasswordAuthData,
) => Promise<OAuthObject>;

export type KeySetFunction = (oauthObject?: OAuthObject) => string;
export type StoreSetFunction = (oauthObject?: OAuthObject) => Promise<void>;

export interface StoreIO {
  /**
   * Attempt to retrieve OAuth data from the implemented store
   * 
   * @param grantType 
   * @param authData 
   */
  get(
    grantType: GrantType,
    authData:
      | RefreshTokenAuthData
      | CodeAuthData
      | AppAuthData
      | PasswordAuthData,
  ): Promise<OAuthObject>;

  /**
   * Save OAuth information for a future usage
   * 
   * @param oauth 
   */
  set(oauth: OAuthObject): Promise<void>;
}
