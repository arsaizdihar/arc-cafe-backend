import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import prisma from "../core/prisma";
import signJWT from "../utils/signJWT";

const extractJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.token;

  if (token) {
    jwt.verify(token, config.token.secret, async (error, decoded) => {
      if (error) {
        next();
      } else if (typeof decoded === "object") {
        prisma.user
          .findUnique({
            where: { id: decoded.id },
          })
          .then((user) => {
            if (decoded.exp) {
              const now = new Date().getTime();
              if (
                decoded.exp * 1000 - now <= config.token.expireTime * 500 &&
                user
              ) {
                signJWT(user, res, false);
              }
            }
            res.locals.user = user;
            next();
          })
          .catch((_error) => {
            return res.status(500).json({
              message: _error.message,
              error: _error,
            });
          });
      } else {
        return res.status(500);
      }
    });
  } else {
    next();
  }
};

export default extractJWT;
