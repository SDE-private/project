import { Router } from "express";
import { requireGoogleAuth } from "../middleware/oauth.js";
import generateJWT from "../utils.js";

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
    const user_info = {
      username: req.user.displayName,
      email: req.user.emails[0].value,
    };
    const token = generateJWT(user_info);
    let user = await fetch(`http://localhost:3000/db/get_current_user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    if (user.status !== 200) {
      user = await fetch("http://localhost:3000/db/add_current_user", {
        method: "POST",
        body: JSON.stringify(user_info),
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
    }
    req.user = await user.json();
    if (!req.user.error) {
      res.cookie("sde-token", token);
      res.redirect(`http://localhost/app/#/auth?token=${token}`);
    }
    else res.redirect("http://localhost/app/#/fail");
  } catch (error) {
    console.log(error);
  }
});

middleware.get("/logout", (req, res) => {
  res.clearCookie("sde-token");
  req.session.destroy(() => { res.redirect("http://localhost/app/"); });
});

export default middleware;
