import express from "express";
import controllers from "../controllers";
import loginRequired from "../middlewares/loginRequired";

const {
  auth: { register, login, me, logout },
} = controllers;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", loginRequired, me);
router.post("/logout", loginRequired, logout);

export default router;
