export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
};

export type RefreshTokenResponse = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};
