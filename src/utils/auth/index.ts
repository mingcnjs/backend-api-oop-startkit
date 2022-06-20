import axios from "axios";
import config from "../../config";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../../definitions/types/auth";

const AUTH_BASE_PATH =
  `http://${config.firebase.authEmulatorHost}/` || "https://";
const AUTH_BASE_URL = `${AUTH_BASE_PATH}identitytoolkit.googleapis.com/v1`;
const TOKEN_SERVICE_BASE_URL = `${AUTH_BASE_PATH}securetoken.googleapis.com/v1`;

export class FirebaseAuthUtil {
  authInstance = axios.create({ baseURL: AUTH_BASE_URL });
  tokenInstance = axios.create({ baseURL: TOKEN_SERVICE_BASE_URL });

  public async loginToFirebase({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse | undefined> {
    try {
      const AUTH_URL = `accounts:signInWithPassword?key=${config.firebase.webApiKey}`;
      const loginRequestBody = {
        email,
        password,
        returnSecureToken: true,
      };

      const { data } = await this.authInstance.post<LoginResponse>(
        AUTH_URL,
        loginRequestBody
      );

      return data;
    } catch (e) {
      console.info("LoginToFirebase Error", (e as Error).message);
      return undefined;
    }
  }

  public async getRefreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse | undefined> {
    try {
      const url = `token?key=${config.firebase.webApiKey}`;
      const body = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      };

      const { data } = await this.tokenInstance.post<RefreshTokenResponse>(
        url,
        body
      );

      return data;
    } catch (e) {
      console.info("GetRefreshToken Error", (e as Error).message);
      return undefined;
    }
  }
}

export const firebaseAuthUtil = new FirebaseAuthUtil();
