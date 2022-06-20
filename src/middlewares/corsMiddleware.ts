import Cors from "cors";

const whitelist = ["http://localhost:3000", "http://localhost:3001"];

const options: Cors.CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || (origin && whitelist.indexOf(origin) !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export const cors = Cors(options);
