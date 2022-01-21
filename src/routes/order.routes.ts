import express from "express";
import { body } from "express-validator";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const {
  order: { checkoutOrder, payOrder, getOrders, getOrder },
} = controllers;

const router = express.Router();

router.post(
  "/checkout",
  loginRequired,
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Ids must be an array of string id."),
  body("ids.*").isString().withMessage("Ids must be an array of string id."),
  checkoutOrder
);
router.post("/pay", loginRequired, payOrder);
router.get("/:id", getOrder);
router.get("/", getOrders);

export default router;
