import { UserInfo } from "firebase-admin/lib/auth/user-record";
import { UserRole, UserStatus } from "../../enums";

export type UserDetail = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type User = Omit<
  UserInfo & UserDetail,
  "displayName" | "photoURL" | "providerId" | "toJSON" | "phoneNumber"
> & {
  role: UserRole;
  status: UserStatus;
};

export type UserAccessLevel = {
  isManager: boolean;
  isUser: boolean;
};

export type RequestUser = UserAccessLevel & {
  uid: string;
  email: string;
};

export type UserCreate = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};
