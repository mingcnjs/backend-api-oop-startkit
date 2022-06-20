import { UserRecord } from "firebase-admin/lib/auth/user-record";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { User } from "../../definitions/types/auth/User";
import { UserRole, UserStatus } from "../../definitions/enums/";
import { hasAllValues } from "..";

export async function isValidUser(user: UserRecord) {
  return hasAllValues(user, ["email"]);
}

export const schema: JSONSchemaType<Omit<User, "signUpDetails">> = {
  type: "object",
  properties: {
    uid: { type: "string" },
    email: { type: "string" },
    firstName: { type: "string", minLength: 2, maxLength: 50 },
    lastName: { type: "string", minLength: 2, maxLength: 50 },
    role: {
      type: "string",
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: "string",
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  required: ["email", "firstName", "lastName"],
};

export function validateUser() {
  const ajv = new Ajv({
    useDefaults: true,
    removeAdditional: "all",
  });
  addFormats(ajv);
  return ajv.compile(schema);
}
