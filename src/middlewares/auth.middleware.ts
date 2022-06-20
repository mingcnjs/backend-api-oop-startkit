import { NextFunction, Response } from "express";
import { IRequestWithUser } from "../definitions/interfaces/IRequestWithUser";
import authService from "../services/auth.service";
import { getAccessLevelFromRole } from "../utils/accessLevel";
import HttpException from "../utils/exceptions/HttpException";

async function authMiddleware(
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (authToken) {
    try {
      const user = await authService.verifyIdToken(authToken);

      req.user = {
        uid: user.uid,
        email: user.email!,
        ...getAccessLevelFromRole(user.role),
      };
      next();
    } catch (err) {
      console.error(err);
      next(new HttpException(401, "Invalid or expired Authorization Header"));
    }
  } else {
    next(new HttpException(401, "Missing Authorization Header"));
  }
}

export default authMiddleware;
