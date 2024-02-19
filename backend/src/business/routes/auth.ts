import { Router } from "express";
import generateJWT from "../utils.js";
import { requireGoogleAuth } from "../middleware/oauth.js";
import { User } from "../adapters/db_controller.js";
import check from "../middleware/check.js";

const middleware = Router();

middleware.get("/failed", (req, res) => {
  res.json({
    error: "failed",
  });
});

middleware.get(
  "/google",
  (req: any, res, next) => {
    next();
  },
  requireGoogleAuth,
);

middleware.get("/google/callback", requireGoogleAuth, async (req: any, res) => {
  try {
    const username = encodeURIComponent(req.user.displayName);
    let user = await fetch(`http://localhost:3000/db/get_user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (user.status !== 200) {
      const user_info = {
        username: req.user.displayName,
        email: req.user.emails[0].value,
        songs: [],
      };
      user = await fetch("http://localhost:3000/db/add_user", {
        method: "POST",
        body: JSON.stringify(user_info),
        headers: { "Content-Type": "application/json" },
      });
    }
    req.user = await user.json();
    const token = generateJWT(req.user);
    // res.redirect(`http://sde-frontend/#/auth?token=${token}`);
    res.redirect(`http://localhost:8080/#/auth?token=${token}`);
  } catch (error) {
    console.log(error);
  }
});

middleware.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("sde-token");
    const redirect = req.query.redirect || "/auth";
    res.redirect(redirect as string);
  });
});

export default middleware;
