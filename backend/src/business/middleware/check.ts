import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const check = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["sde-token"];
  if (token) {
    jwt.verify(token, "sde", (err: any, user: any) => {
      if (err) {
        res.redirect("/auth/google");
      }
      req.user = user;
      next();
    });
  } else {
    res.redirect("/auth/google");
  }
};

export default check;
