import bcryptjs from "bcryptjs";
import { RequestHandler } from "express";
import prisma from "../core/prisma";
import signJWT from "../utils/signJWT";

const register: RequestHandler = async (req, res) => {
  let { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "email, password, and name required" });
  }
  const hash = await bcryptjs.hash(password, 10);
  prisma.user
    .create({ data: { email, name, password: hash } })
    .then((user) => res.status(201).json({ ...user, password: undefined }))
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
  res.clearCookie("token");
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
