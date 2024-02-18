import { Router } from "express";
import authRouter from "./auth.js";
import songsRouter from "./song_library.js";
import analyzeRouter from "./analyzer.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/songs-library", songsRouter);
router.use("/analyze", analyzeRouter);

export default router;
