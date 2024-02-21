import { isAlreadyAnalyzed, setAnalyzed } from "./db_controller.js";
import { User } from "./db_controller.js";

// @ts-expect-error types
const spleeterController = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ error: "id is required" });
    }

    let username = (req.user as User).username;
    let song_id = req.body.id;
    if (!(await isAlreadyAnalyzed(username, song_id))) {
      const id = { id: song_id };
      const result = await fetch(`http://sde-spleeter_lib:5000/`, {
        method: "POST",
        body: JSON.stringify(id),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      if (!result) {
        return res.status(404).json({ error: "song not found" });
      } else {
        await setAnalyzed(username, song_id);
        return res.status(200).json(result);
      }
    } else {
      return res.status(200).json({
        stems: {
          vocals: `/media/${song_id}/vocals.mp3`,
          accompaniment: `/media/${song_id}/accompaniment.mp3`,
          bass: `/media/${song_id}/bass.mp3`,
          drums: `/media/${song_id}/drums.mp3`,
          other: `/media/${song_id}/other.mp3`,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default spleeterController;
