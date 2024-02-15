import { Router } from "express";
import check from "../middleware/check.js";

const router = Router();

router.get("/login", check, (req, res) => {
  res.redirect("/app");
});

router.get("/", (req, res) => res.send("Hello World (Process)"));

router.get("/logout", (req, res) => {
  res.redirect(
    "http://localhost:3000/auth/logout?redirect=http://localhost:3001/",
  );
});

router.get("/app", check, (req, res) => res.send("APP"));

export default router;
