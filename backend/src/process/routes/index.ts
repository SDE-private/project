import { Router } from "express";
import check from "../middleware/check.js";
import authRouter from "./auth.js";
import songsRouter from "./song_library.js";
import analyzeRouter from "./analyzer.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/songs-library", songsRouter);
router.use("/analyze", analyzeRouter);
router.get("/app", check, (req, res) => res.send("APP"));

export default router;
