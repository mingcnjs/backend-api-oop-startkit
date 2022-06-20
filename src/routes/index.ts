import { Router } from "express";
// import IndexController from "../controllers/index.controller";
import { IRoute } from "../definitions/interfaces/IRoute";

class IndexRoute implements IRoute {
  public path = "/";
  public router = Router();
  //   public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
