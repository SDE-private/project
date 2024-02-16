import { Router } from "express";
import check from "../middleware/check.js";
import { User } from "../../business/adapters/db_controller";

const songsRouter = Router();

songsRouter.get("/songs", check, (req, res) => {
  const songs = (req.user as User).songs;
  res.json(songs);
});

export default songsRouter;
