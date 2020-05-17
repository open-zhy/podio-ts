import { OAuthObject } from "./oauth.d.ts";

export const GRANT_TYPE_APP = "app";
export const GRANT_TYPE_REFRESH_TOKEN = "refresh_token";
export const GRANT_TYPE_PASSWORD = "password";
export const GRANT_TYPE_CODE = "code";

export class PodioOAuthToken {
  constructor(public data: OAuthObject | any) {
    this.data = data;
  }
}
