import { Router } from "express";
import generateJWT from "../utils.js";
import { requireGoogleAuth } from "../middleware/oauth.js";
import { User } from "../database/database.js";
import check from "../middleware/check.js";

const middleware = Router();

middleware.get("/", (req, res) => {
  res.json({ message: "You are not logged in" });
});

middleware.get("/failed", (req, res) => {
  res.send("Failed");
});

middleware.get("/success", check, (req, res) => {
  const user = req.user as User;
  res.send(`Welcome ${user.username}!`);
});

middleware.get("/google", requireGoogleAuth);

middleware.get("/google/callback", requireGoogleAuth, (req: any, res) => {
  const user: User = {
    username: req.user.displayName,
    email: req.user.emails[0].value,
    songs: [],
  };
  const token = generateJWT(user);
  res.cookie("sde-token", token);
  const returnTo = req.cookies["sde-returnTo"] || "/auth/success";
  res.redirect(returnTo);
});

middleware.get("/test", check, (req, res) => {
  res.send(req.user);
});

middleware.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("sde-token");
    res.redirect("/auth/");
  });
});

export default middleware;
