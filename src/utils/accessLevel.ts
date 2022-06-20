import { UserRole } from "../definitions/enums";
import { UserAccessLevel } from "../definitions/types/auth/User";

function isUser(role: UserRole | undefined): boolean {
  return role ? [UserRole.USER, UserRole.MANAGER].includes(role) : false;
}

function isManager(role: UserRole | undefined): boolean {
  return role ? [UserRole.MANAGER].includes(role) : false;
}

export const getAccessLevelFromRole = (
  role: UserRole | undefined
): UserAccessLevel => ({
  isUser: isUser(role),
  isManager: isManager(role),
});
