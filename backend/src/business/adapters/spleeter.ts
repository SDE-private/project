import { isAlreadyAnalyzed, setAnalyzed } from "./db_controller.js";

// @ts-expect-error types
const spleeterController = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (!req.body.username) {
      return res.status(400).json({ error: "username is required" });
    }

    if (!(await isAlreadyAnalyzed(req.body.username, req.body.id))) {
      const id = { id: req.body.id };
      const result = await fetch(`http://sde-spleeter_lib:5000/`, {
        method: "POST",
        body: JSON.stringify(id),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      if (!result) {
        return res.status(404).json({ error: "song not found" });
      } else {
        setAnalyzed(req.body.username, req.body.id);
        return res.status(200).json(result);
      }
    } else {
      return res.status(200).json({ message: "song already analyzed" });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default spleeterController;
