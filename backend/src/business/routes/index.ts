import { Router } from "express";
import maroofyController from "../adapters/maroofy.js";
import ytDlController from "../adapters/yt_dl.js";
import spleeterController from "../adapters/spleeter.js";
import check from "../middleware/check.js";

const router = Router();

/**
 * @swagger
 *   /maroofy:
 *     post:
 *       summary: Retrieve a list of similar songs
 *       description: Retrieve a list of similar songs given a song title
 *       security:
 *        - cookieAuth: []
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
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sde-token  
 */ 
router.post("/maroofy", check, maroofyController);


/**
 * @swagger
 *   /yt-dl:
 *     post:
 *       summary: Download a song from youtube
 *       description: Providing a youtube link, you are able to download and add the song to yout library
 *       security:
 *        - cookieAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://www.youtube.com/watch?v=HsLqNFIFxnk&pp=ygUXaW8gY2VudHJvIGNvbiBpIG1pc3NpbGk%3D"
 *       responses:
 *         '200':
 *           description: Song's helpful information
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "HsLqNFIFxnk"
 *                   title:
 *                     type: string
 *                     example: "PoP_X 'Io Centro Con I Missili'"
 *                   upload_timestamp:
 *                     type: integer
 *                     example: 1708093435972
 *                   yt_url:
 *                     type: string
 *                     example: "https://www.youtube.com/watch?v=HsLqNFIFxnk"
 *                   analyzed:
 *                     type: boolean
 *                     example: false
 *         '400':
 *           description: Invalid video reference
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid video reference
 *         '500':
 *           description: General error
 *           content:
 *             application/json:
 *               schema:
 *                 type: "object"
 *                 properties:
 *                   error:
 *                     type: "string"
 *                     example: Something went wrong downloading the video...
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sde-token  
 */ 
router.post("/yt-dl", check, ytDlController);

/**
 * @swagger
 *   /spleeter:
 *     post:
 *       summary: Split audio file
 *       description: Split an audio file into its component tracks
 *       security:
 *        - cookieAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "HsLqNFIFxnk"
 *       responses:
 *         '200':
 *           description: Successfully split audio file
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   stems:
 *                     type: object
 *                     properties:   
 *                       accompaniment:       
 *                         type: string       
 *                         example: "/media/HsLqNFIFxnk/accompaniment.wav"
 *                       vocals:       
 *                         type: string       
 *                         example: "/media/HsLqNFIFxnk/vocals.wav"
 *         '400':
 *           description: Bad request, missing parameter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "id is required"
 *         '404':
 *           description: Song not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "song not found"
 *         '500':
 *           description: Server encountered a problem
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 * 
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: sde-token  
 */
router.post("/spleeter", check, spleeterController);

export default router;
