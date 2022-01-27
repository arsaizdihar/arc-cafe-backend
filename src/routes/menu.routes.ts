import express from "express";
import { body } from "express-validator";
import controllers from "../controllers";
import adminOnly from "../middlewares/adminOnly";
import loginRequired from "../middlewares/loginRequired";

const router = express.Router();
const {
  menu: {
    addToCart,
    deleteFromCart,
    getMenus,
    getCartMenus,
    addMenu,
    ...controller
  },
} = controllers;

router.get("/", getMenus);
router.post("/cart", loginRequired, addToCart);
router.delete("/cart/:id", loginRequired, deleteFromCart);
router.get("/cart", loginRequired, getCartMenus);
router.post(
  "/",
  adminOnly,
  body("name", "name is required.").isString(),
  body("price", "price is required.").toInt().isNumeric(),
  body("photoUrl", "photoUrl is required.").isURL(),
  body("type")
    .isIn(["FOOD", "DRINK"])
    .withMessage("type must be FOOD or DRINK."),
  body("composition").isObject(),
  addMenu
);
router.delete("/:id", adminOnly, controller.deleteMenu);
router.patch(
  "/:id",
  adminOnly,
  body("name").optional().isString(),
  body("price", "price is required.").optional().toInt().isNumeric(),
  body("photoUrl", "photoUrl is required.").optional().isURL(),
  body("type")
    .optional()
    .isIn(["FOOD", "DRINK"])
    .withMessage("type must be FOOD or DRINK."),
  body("composition").isObject().optional(),
  controller.updateMenu
);

export default router;
