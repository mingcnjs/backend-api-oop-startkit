import express from "express";
import bodyParser from "body-parser";
import { cors } from "./middlewares/cors.middleware";
import config from "./config";
import errorMiddleware from "./middlewares/error.middleware";
import { IRoute } from "./definitions/interfaces/IRoute";

class App {
  app: express.Application;

  constructor(routes: IRoute[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors);
    this.app.use(bodyParser.json());
  }

  private initializeRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  listen() {
    this.app.listen(config.port, () =>
      console.info(`Server started at http://localhost:${config.port}`)
    );
  }

  get server() {
    return this.app;
  }
}

export default App;
