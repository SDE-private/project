import { Router } from "express";
import { requireGoogleAuth } from "../../business/middleware/oauth.js";

const authRouter = Router();

//TODO: Questo endpoint server per davvero??
authRouter.get("/login", requireGoogleAuth);

authRouter.get("/logout", (req, res) => {
  res.redirect(
    "http://localhost:3000/auth/logout?redirect=http://localhost:3001/",
  );
});

export default authRouter;
