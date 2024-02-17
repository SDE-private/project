import { Router } from "express";
import check from "../middleware/check.js";
import { User } from "../../business/adapters/db_controller.js";

const analyzeRouter = Router();

analyzeRouter.post("/split/:id", check, async (req, res) => {
  // TODO: check if working
  const result = await fetch(`http://localhost:3000/spleeter`, {
    method: "POST",
    body: JSON.stringify({
      id: req.params.id,
      username: (req.user as User).username,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
  console.log(result);
});

export default analyzeRouter;
