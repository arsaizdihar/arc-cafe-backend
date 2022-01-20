import express from "express";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const router = express.Router();
const {
  menu: { addToCart, deleteFromCart, getMenus, getCartMenus },
} = controllers;

router.get("/", getMenus);
router.post("/cart", loginRequired, addToCart);
router.delete("/cart/:id", loginRequired, deleteFromCart);
router.get("/cart", loginRequired, getCartMenus);

export default router;
