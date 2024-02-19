import { Router } from "express";
import {
  connectToDatabase,
  createUser,
  userModel,
} from "../adapters/db_controller.js";

const router = Router();
export default router;

//respond to GET requests on /db-tests
router.get("/conn", async (req, res) => {
  const connected = await connectToDatabase();
  if (connected) {
    res.status(200).json({ status: "Connected" });
  } else {
    console.log("Not connected");
    res.status(400).json({ status: "Not connected" });
  }
});

router.post("/add_user", async (req, res) => {
  console.log("Adding user...");
  const uname: string = req.body.username;
  const mail: string = req.body.email;

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
    console.log("Cannot add user");
    res.status(400).json({ error: "Cannot add user" });
  }
});

//TODO: remove if unused (unsafe)
router.get("/get_users", async (req, res) => {
  console.log("Getting users...");
  await connectToDatabase();

  const users = await userModel.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    console.log("Cannot get users");
    res.status(400).json({ error: "Cannot get users" });
  }
});

//TODO: remove if unused (unsafe)
router.get("/get_user/:username", async (req, res) => {
  const uname = decodeURIComponent(req.params.username);
  console.log("Getting user " + uname + ".");
  await connectToDatabase();

  const user = await userModel.findOne({ username: uname });
  if (user) {
    res.status(200).json(user);
  } else {
    console.log("Cannot get user " + uname);
    res.status(400).json({ error: "Cannot get user " + uname });
  }
});


//fixa docs e aggiungi quelli del db