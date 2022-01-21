import type { NextFunction, Request, Response } from "express";

const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user?.isAdmin) {
    return res.status(401).json({ message: "Admin only" });
  } else {
    next();
  }
};

export default adminOnly;
