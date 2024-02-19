import { Router } from "express";
import {
  connectToDatabase,
  createUser,
  User,
  userModel,
} from "../adapters/db_controller.js";
import { checkUser } from "../middleware/check.js";

const router = Router();
export default router;

//respond to GET requests on /db-tests
router.get("/conn", async (req, res) => {
  const connected = await connectToDatabase();
  if (connected) {
    res.status(200).json({ status: "Connected" });
  } else {
    res.status(400).json({ status: "Not connected" });
  }
});

router.post("/add_current_user", checkUser, async (req, res) => {
  const user = req.user as User;
  const uname = user.username;
  const mail = user.email;
  console.log("Getting user " + uname + ".");

  //doesn't matter if already connected.. it will check if it is connected before startign the whole procedure
  await connectToDatabase();

  const created: boolean = await createUser({
    username: uname,
    email: mail,
    songs: [],
  });
  if (created) {
    const user = await userModel.findOne({
      username: uname,
    });
    res.status(200).json(user);
  } else {
    res.status(400).json({ error: "Cannot add user" });
  }
});

router.get("/get_current_user", checkUser, async (req, res) => {
  const uname = (req.user as User).username;
  console.log("Getting user " + uname + ".");
  await connectToDatabase();

  const user = await userModel.findOne({ username: uname });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ error: "Cannot get user " + uname });
  }
});

//fixa docs e aggiungi quelli del db