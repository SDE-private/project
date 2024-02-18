import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const check = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string;
  console.log(token);
  if (token) {
    jwt.verify(token, "sde", (err: any, user: any) => {
      if (err) {
        res.json({
          error: "not logged in"
        });
        return;
      }
      req.user = user;
      next();
    });
  } else {
    res.json({
      error: "not logged in"
    });
  }
};

export default check;
