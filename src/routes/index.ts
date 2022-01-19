import express from "express";
import authRouter from "./auth.ruotes";
import menuRouter from "./menu.routes";
import orderRouter from "./order.routes";

const router = express.Router();
router.use("/auth", authRouter);
router.use("/menus", menuRouter);
router.use("/orders", orderRouter);

export default router;
