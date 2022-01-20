import express from "express";
import { body } from "express-validator";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const {
  auth: { register, login, me, logout },
} = controllers;

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().normalizeEmail().withMessage("Email is invalid."),
  body("name", "Name is required")
    .isLength({ min: 4 })
    .withMessage("Minimum length of name is 4."),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Minimum length of password is 4."),
  register
);
router.post("/login", login);
router.get("/me", loginRequired, me);
router.post("/logout", loginRequired, logout);

export default router;
