import { Router } from "express";
import { requireGoogleAuth } from "../../business/middleware/oauth.js";

const authRouter = Router();


/**
 * @swagger
 *   /auth/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Redirects to Google's login page
 *       description: Redirects to Google's login page
*/
authRouter.get("/login", requireGoogleAuth);

/**
 * @swagger
 *   /auth/logout:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Logs the user out
 *       description: Logs the user out
 *
 */
authRouter.get("/logout", async (req, res) => {
  await fetch("http://localhost:3000/auth/logout", {
    method: "GET",
  });
  return res.status(200).json({ message: "Logged out" });
});

export default authRouter;
