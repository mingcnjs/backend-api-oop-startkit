import { Request } from "express";
import { RequestUser } from "../types/auth/User";

export interface IRequestWithUser extends Request {
  user: RequestUser;
}
