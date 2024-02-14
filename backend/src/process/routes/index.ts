import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.cookie("sde-returnTo", "http://localhost:3001/app");
  res.redirect("http://localhost:3000/auth/google");
});

export default router;
