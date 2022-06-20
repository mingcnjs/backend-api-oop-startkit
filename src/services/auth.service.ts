import { USER_MODEL_NAME } from "../definitions/constants/models";
import { User, UserCreate, UserDetail } from "../definitions/types/auth/User";
import {
  hasAllValues,
  hasAnyValue,
  mergeUserData,
  removeNulls,
} from "../utils";
import { getAccessLevelFromRole } from "../utils/accessLevel";
import HttpException from "../utils/exceptions/HttpException";
import ValidationException from "../utils/exceptions/ValidationException";
import { firebaseAuth } from "../utils/firebase";
import { sendPasswordResetEmail } from "../utils/mailer";

import { firebaseAuthUtil } from "../utils/auth";
import { UserRole } from "../definitions/enums";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../definitions/types/auth";
import { isValidUser } from "../utils/validations/user";
import { BaseFirebaseService } from "./base.service";

class AuthService extends BaseFirebaseService<UserDetail> {
  constructor() {
    super();
    this.init(USER_MODEL_NAME);
  }

  public async createUser(
    userData: UserCreate
  ): Promise<{ authToken: string; user: User }> {
    if (
      !hasAllValues(userData, [
        "firstName",
        "lastName",
        "email",
        "password",
        "role",
      ])
    ) {
      throw new ValidationException("Missing required fields.");
    }

    const { firstName, lastName, email, password, role } = userData;

    if (![UserRole.MANAGER, UserRole.USER].includes(role)) {
      throw new ValidationException("Invalid user role");
    }
    const payload: Partial<User> = {
      firstName,
      lastName,
      email,
    };
    const userAuth = await firebaseAuth.createUser({
      ...payload,
      displayName: `${firstName} ${lastName}`.trim(),
      password,
    });

    await firebaseAuth.setCustomUserClaims(userAuth.uid, {
      role,
    });
    await this.set(userAuth.uid, payload);

    return {
      authToken: await firebaseAuth.createCustomToken(userAuth.uid),
      user: await this.getUserById(userAuth.uid),
    };
  }

  public async login(
    loginRequest: LoginRequest
  ): Promise<LoginResponse & { authToken: string; user: User }> {
    if (!hasAllValues(loginRequest, ["email", "password"])) {
      throw new ValidationException("Missing required parameters to login.");
    }

    const { email } = loginRequest;
    const result = await firebaseAuthUtil.loginToFirebase(loginRequest);

    if (!result) {
      throw new ValidationException("The login information is not correct.");
    }

    const user = await this.getUserByEmail(email);
    const authToken = await firebaseAuth.createCustomToken(user.uid);

    if (!getAccessLevelFromRole(user.role).isManager) {
      throw new HttpException(403, "Permission denied.");
    }

    return {
      ...result,
      authToken,
      user,
    };
  }

  public async refreshToken(
    token: string | undefined
  ): Promise<RefreshTokenResponse> {
    if (!token) {
      throw new ValidationException("Missing refresh token.");
    }

    const result = await firebaseAuthUtil.getRefreshToken(token);

    if (!result) {
      throw new ValidationException("The refresh token is not correct.");
    }

    return result;
  }

  async updateUser(uid: string, userData: Partial<User>): Promise<User> {
    if (hasAnyValue(userData, ["email"])) {
      throw new ValidationException("Attempting to modify un-editable email.");
    }

    const payload: Partial<UserDetail> = {
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    removeNulls<Partial<UserDetail>>(payload);

    await this.update(uid, payload);

    const user = await this.getUserById(uid);

    return user;
  }

  async sendPasswordReset(email: string, baseURL = "") {
    if (!baseURL) {
      throw new ValidationException("Base URL is not provided");
    }

    const user = await this.getUserByEmail(email);

    const passwordResetLink = await firebaseAuth.generatePasswordResetLink(
      email
    );

    await sendPasswordResetEmail(user.email, passwordResetLink, baseURL);
    return { success: true };
  }

  async verifyIdToken(token: string) {
    try {
      return await firebaseAuth.verifyIdToken(token, true);
    } catch (err) {
      throw new ValidationException(
        "Invalid ID Token Provided. Unable to verify identity."
      );
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const userRecord = await firebaseAuth.getUserByEmail(email);

    if (!isValidUser(userRecord)) {
      throw new ValidationException(
        "Sorry, we can’t find this email. Please contact admin."
      );
    }

    const userDetail = await this.get(userRecord.uid);

    return mergeUserData({
      userRecord,
      userDetail,
    });
  }

  async getUserById(uid: string): Promise<User> {
    const [userRecord, userDetail] = await Promise.all([
      firebaseAuth.getUser(uid),
      this.get(uid),
    ]);

    if (!isValidUser(userRecord)) {
      throw new ValidationException(
        "Sorry, we can’t find this email. Please contact admin."
      );
    }

    return mergeUserData({
      userRecord,
      userDetail,
    });
  }
}

export default new AuthService();
