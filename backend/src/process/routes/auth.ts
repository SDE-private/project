import { Router } from "express";
import check from "../middleware/check.js";

const authRouter = Router();

//TODO: Questo endpoint server per davvero??
authRouter.get("/login", check, (req, res) => {
  res.redirect("/app");
});

authRouter.get("/logout", (req, res) => {
  res.redirect(
    "http://localhost:3000/auth/logout?redirect=http://localhost:3001/",
  );
});

export default authRouter;
