import { Router } from "express";
import generateJWT from "../utils.js";
import { requireGoogleAuth } from "../middleware/oauth.js";
import { createUser, getUser, User } from "../adapters/db_controller.js";
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

middleware.get(
  "/google",
  (req: any, res, next) => {
    req.session.redirect = req.query.redirect || "/auth/success";
    next();
  },
  requireGoogleAuth,
);

middleware.get("/google/callback", requireGoogleAuth, async (req: any, res) => {
  try {
    let user = await getUser(req.user.displayName);
    if (user === null) {
      user = {
        username: req.user.displayName,
        email: req.user.emails[0].value,
        songs: [],
      };
      await createUser(user);
      user = await getUser(req.user.displayName);
    }
    req.user = user;
    const token = generateJWT(req.user);
    res.cookie("sde-token", token);
    const returnTo = req.session.redirect;
    res.redirect(returnTo);
  } catch (error) {
    console.log(error);
  }
});

middleware.get("/test", check, (req, res) => {
  res.send(req.user);
});

middleware.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("sde-token");
    const redirect = req.query.redirect || "/auth";
    res.redirect(redirect as string);
  });
});

export default middleware;
