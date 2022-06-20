import { NextFunction, Response, Router } from "express";
import { IRequestWithUser } from "../definitions/interfaces/IRequestWithUser";
import { IRoute } from "../definitions/interfaces/IRoute";

type RouteFunc = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => Promise<void>;

class BaseRoute implements IRoute {
  public path = "";
  public router = Router();

  protected routes = Array<{
    method: string;
    route: string;
    controller: RouteFunc;
    middlewares: Array<RouteFunc>;
  }>();

  protected initializeRoutes() {
    this.routes.forEach((route) => {
      // eslint-disable-next-line
      (this.router as any)[route.method](
        `${this.path}${route.route}`,

        route.middlewares,

        route.controller
      );
    });
  }
}

export default BaseRoute;
