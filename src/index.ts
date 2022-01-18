import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import config from "./config";
import extractJWT from "./middlewares/extractJWT";
import routes from "./routes";

const app = express();

app.use(cors({ credentials: true, origin: config.origin }));
app.use(express.json());
app.use(cookieParser());
app.use(extractJWT);

app.use("/api/auth", routes.auth);

app.listen(
  config.PORT,
  () => `App is running on http://localhost:${config.PORT}`
);
