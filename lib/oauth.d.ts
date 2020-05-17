export type OAuthObject = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;

  // runtime property
  isInvalid?: boolean;
};

export type GrantType =
  | "refresh_token"
  | "app"
  | "password"
  | "code";

export type RefreshTokenAuthData = {
  refresh_token: string;
};

export type CodeAuthData = {
  code: string;
};

export type AppAuthData = {
  app_id: number;
  app_token: string;
};

export type PasswordAuthData = {
  useranme: string;
  password: string;
};
