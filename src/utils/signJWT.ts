import { User } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const NAMESPACE = "Auth";

const signJWT = (user: User, res: Response, endResponse = true) => {
  const now = new Date().getTime();
  const expiresTime = now + config.token.expireTime * 1000;
  const expires = new Date(expiresTime);

  try {
    const token = jwt.sign({ id: user.id }, config.token.secret, {
      issuer: config.token.issuer,
      algorithm: "HS256",
      expiresIn: config.token.expireTime,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires,
    });
    if (endResponse)
      return res.json({ user: { ...user, password: undefined } });
  } catch (error: any) {
    if (endResponse)
      return res.status(500).json({ message: error.message, error });
  }
};

export default signJWT;
