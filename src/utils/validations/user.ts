import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { User } from "../../definitions/types/auth/User";
import { UserRole } from "../../definitions/enums/";

export const schema: JSONSchemaType<Omit<User, "signUpDetails">> = {
  type: "object",
  properties: {
    id: { type: "string" },
    email: { type: "string" },
    firstName: { type: "string", maxLength: 100 },
    lastName: { type: "string", maxLength: 100 },
    role: {
      type: "string",
      enum: Object.values(UserRole),
      default: UserRole.USER,
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
