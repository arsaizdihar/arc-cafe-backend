import express from "express";
import authRouter from "./auth.ruotes";
import menuRouter from "./menu.routes";

const router = express.Router();
router.use("/auth", authRouter);
router.use("/menus", menuRouter);

export default router;
