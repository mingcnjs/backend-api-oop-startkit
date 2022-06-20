import { UserRole } from "../../enums";

export type UserDetail = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export type User = UserDetail & {
  id: string;
};

export type UserAccessLevel = {
  isManager: boolean;
  isUser: boolean;
};
