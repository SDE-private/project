import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserInfo } from "../adapters/db_controller";

const check = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  const token = req.headers["authorization"] as string;
  if (token) {
    //@ts-ignore
    req.token = token;
    jwt.verify(token, "sde", async (err: any, user: any) => {
      if (err) {
        console.log(err);
        // TODO: should just return an error
        res.status(403).json({ error: "Not a valid token" });
        return;
      }
      const infos = user as UserInfo;
      const songs = await fetch("http://localhost:3000/db/get_current_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
        .then((res) => res.json())
        .then((user) => user?.songs);
      req.user = <User>{
        username: infos!.username,
        email: infos!.email,
        songs: songs,
      };
      next();
    });
  } else {
    // TODO: should just return an error
    res.status(403).json({ error: "No token provided" });
    return;
  }
};

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string;
  if (token) {
    //@ts-ignore
    req.token = token;
    jwt.verify(token, "sde", async (err: any, user: any) => {
      if (err) {
        console.log(err);
        res.status(403).json({ error: "Not a valid token" });
        return;
      }
      const infos = user as UserInfo;
      req.user = <User>{
        username: infos!.username,
        email: infos!.email,
      };
      next();
    });
  } else {
    res.status(403).json({ error: "No token provided" });
    return;
  }
};

export { check, checkUser };
