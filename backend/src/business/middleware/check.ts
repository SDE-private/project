import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const check = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string;
  console.log(req.headers);
  if (token) {
    jwt.verify(token, "sde", (err: any, user: any) => {
      if (err) {
        res.json({
          error: "not a valid token"
        });
        return;
      }
      req.user = user;
      next();
    });
  } else {
    res.json({
      error: "no token"
    });
  }
};

export default check;
