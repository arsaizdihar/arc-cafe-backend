import express from "express";
import config from "./config";
import prisma from "./prisma";

const app = express();
app.use(express.json());

app.get("/api/user/count", async (req, res) => {
  return res.json(await prisma.user.count());
});

app.listen(
  config.PORT,
  () => `App is running on http://localhost:${config.PORT}`
);
