import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const check = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.originalUrl);
  const token = req.cookies["sde-token"];
  if (token) {
    jwt.verify(token, "sde", (err: any, user: any) => {
      if (err) {
        res.redirect(
          `http://localhost:3000/auth/google?redirect=http://localhost:3001${req.originalUrl}`,
        );
      }
      req.user = user;
      next();
    });
  } else {
    res.redirect(
      `http://localhost:3000/auth/google?redirect=http://localhost:3001${req.originalUrl}`,
    );
  }
};

export default check;
