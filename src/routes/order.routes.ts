import express from "express";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const {
  order: { checkoutOrder, payOrder, getOrder },
} = controllers;

const router = express.Router();

router.post("/checkout", loginRequired, checkoutOrder);
router.post("/pay", loginRequired, payOrder);
router.get("/", getOrder);

export default router;
