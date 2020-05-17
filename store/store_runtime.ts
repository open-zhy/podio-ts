import {
  OAuthObject,
  GrantType,
  RefreshTokenAuthData,
  CodeAuthData,
  AppAuthData,
  PasswordAuthData,
} from "../lib/oauth.d.ts";
import { StoreIO, KeyGetFunction, KeySetFunction } from "./store.d.ts";

type KeyStore = Map<string, any>;

export class RuntimeStore implements StoreIO {
  constructor(
    public keyGet: KeyGetFunction = () => "default",
    public keySet: KeySetFunction = () => "default",
    private map: KeyStore = new Map(),
  ) {}

  get(
    grantType: GrantType,
    authData:
      | RefreshTokenAuthData
      | CodeAuthData
      | AppAuthData
      | PasswordAuthData,
  ): Promise<OAuthObject> {
    return new Promise(
      (r) =>
        r(
          this.map.get(
            this.keyGet(grantType, authData),
          ) || { isInvalid: true },
        ),
    );
  }

  set(oauth: OAuthObject): Promise<void> {
    this.map.set(this.keySet(oauth), oauth);
    return new Promise(
      (r) => r(),
    );
  }
}
