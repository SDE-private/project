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


/**
 * @swagger
 *   /db/conn:
 *     post:
 *       tags:
 *         - Database interaction
 *       summary: Checks connection with the database
 *       description: Checks if the server is connected to the database
 *       security:
 *        - tokenAuth: []
 *       responses:
 *         '200':
 *           description: Connection is up
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "Connected"
 *         '400':
 *           description: Connection is down
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "Not connected"
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
router.get("/conn", async (req, res) => {
  const connected = await connectToDatabase();
  if (connected) {
    res.status(200).json({ status: "Connected" });
  } else {
    res.status(400).json({ status: "Not connected" });
  }
});

/**
 * @swagger
 *   /db/add_current_user:
 *     post:
 *       tags:
 *         - Database interaction
 *       summary: Adds authenticated user to the database
 *       description: Adds the user that has just completed the OAuth authentication to the database
 *       security:
 *        - tokenAuth: []
 *       responses:
 *         '200':
 *           description: User successfully added
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: "Luca Moretti"
 *                   email:
 *                     type: string
 *                     example: "luca.moretti@studenti.unitn.it"
 *                   songs:
 *                     type: array
 *                     example: []
 *         '400':
 *           description: Missing parameter
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Cannot add user
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
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

/**
 * @swagger
 *   /db/get_current_user:
 *     post:
 *       tags:
 *         - Database interaction
 *       summary: Gets authenticated user from the database
 *       description: Gets the user that has just completed the OAuth authentication from the database
 *       security:
 *        - tokenAuth: []
 *       responses:
 *         '200':
 *           description: User successfully retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: "Luca Moretti"
 *                   email:
 *                     type: string
 *                     example: "luca.moretti@studenti.unitn.it"
 *                   songs:
 *                     type: array
 *                     example: []
 *         '400':
 *           description: Missing parameter
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Cannot get user Luca Moretti
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
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