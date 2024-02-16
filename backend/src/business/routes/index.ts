import { Router } from "express";
import maroofyController from "../adapters/maroofy.js";
import ytDlController from "../adapters/yt_dl.js";
import spleeterController from "../adapters/spleeter.js";

const router = Router();

/**
 * @swagger
 *   /moorofy:
 *     post:
 *       summary: Retrieve a list of similar songs
 *       description: Retrieve a list of similar songs given a song title
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "All the Small Things"
 *       responses:
 *         '200':
 *           description: A list of similar songs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     song_name:
 *                       type: string
 *                     artist_name:
 *                       type: string
 *                     url:
 *                       type: string
 *         '400':
 *           description: Missing parameter
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: title is required
 *         '404':
 *           description: No informations found
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: song not found
 *         '500':
 *           description: Server encountered a problem
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: "string"
 *
 *
 *
 *
 */
router.post("/maroofy", maroofyController);

router.post("/yt-dl", ytDlController);

router.post("/spleeter", spleeterController);

export default router;
