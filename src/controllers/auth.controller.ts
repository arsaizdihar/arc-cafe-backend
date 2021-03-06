import bcryptjs from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import config from "../config";
import prisma from "../core/prisma";
import fieldErrors from "../utils/fieldErrors";
import signJWT from "../utils/signJWT";

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return fieldErrors(errors, res);
  }

  let { email, password, name } = req.body;

  const hash = await bcryptjs.hash(password, 10);
  prisma.user
    .create({ data: { email, name, password: hash } })
    .then((user) => {
      signJWT(user, res, false);
      res.status(201).json({ ...user, password: undefined });
    })
    .catch((err) => {
      return res.status(400).json({ message: err.message, error: err });
    });
};

const login: RequestHandler = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  bcryptjs.compare(password, user.password, (error, result) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", error });
    } else if (result) {
      return signJWT(user, res);
    } else {
      return res
        .status(400)
        .json({ message: "Invalid email or password", error });
    }
  });
};

const logout: RequestHandler = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: !config.DEV,
  });
  return res.status(200).json({ message: "Logout successfully" });
};

const me: RequestHandler = (req, res) => {
  return res.json({ ...res.locals.user, password: undefined });
};

export default {
  register,
  logout,
  login,
  me,
};
