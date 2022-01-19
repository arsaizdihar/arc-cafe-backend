import express from "express";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const router = express.Router();
const {
  menu: { addToChart, deleteFromChart, getMenus, getChartMenus },
} = controllers;

router.get("/", getMenus);
router.post("/chart", loginRequired, addToChart);
router.delete("/chart", loginRequired, deleteFromChart);
router.get("/chart", loginRequired, getChartMenus);

export default router;
