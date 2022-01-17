import express from "express";
import config from "./config";

const app = express();
app.use(express.json());

app.listen(
  config.PORT,
  () => `App is running on http://localhost:${config.PORT}`
);
