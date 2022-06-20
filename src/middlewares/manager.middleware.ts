import { NextFunction, Response } from "express";
import { IRequestWithUser } from "../definitions/interfaces/IRequestWithUser";
import HttpException from "../utils/exceptions/HttpException";

async function managerMiddleware(
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.user.isManager) {
    next();
  } else {
    next(
      new HttpException(401, "You are not authorized to access these endpoint.")
    );
  }
}

export default managerMiddleware;
