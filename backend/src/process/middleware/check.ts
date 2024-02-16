import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserInfo, getUser } from "../../business/adapters/db_controller.js";

const check = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.originalUrl);
  const token = req.cookies["sde-token"];
  if (token) {
    jwt.verify(token, "sde", async (err: any, user: any) => {
      if (err) {
        res.redirect(
          `http://localhost:3000/auth/google?redirect=http://localhost:3001${req.originalUrl}`,
        );
      }
      const infos = (user as UserInfo);
      const songs = await getUser(infos!.username).then((user) => user?.songs);
      req.user = <User>{
        username: infos!.username,
        email: infos!.email,
        songs: songs,
      };
      next();
    });
  } else {
    res.redirect(
      `http://localhost:3000/auth/google?redirect=http://localhost:3001${req.originalUrl}`,
    );
  }
};

export default check;
