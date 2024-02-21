import { Router } from "express";
import { User } from "../../business/adapters/db_controller.js";
import { check } from "../../business/middleware/check.js";

const analyzeRouter = Router();

/**
 * @swagger
 * paths:
 *  /analyze/split/{id}:
 *     post:
 *       tags:
 *         - Analyze
 *       summary: Split audio file
 *       description: Split an audio file into its component tracks
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             description: ID of the audio file
 *             example: "HsLqNFIFxnk"
 *       security:
 *        - tokenAuth: []
 *       responses:
 *          '200':
 *            description: Successfully split audio file
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    stems:
 *                      type: object
 *                      properties:
 *                         accompaniment:
 *                            type: string
 *                            example: "/media/HsLqNFIFxnk/accompaniment.mp3"
 *                         vocals:
 *                            type: string
 *                            example: "/media/HsLqNFIFxnk/vocals.mp3"
 *                         bass:
 *                           type: string
 *                           example: "/media/HsLqNFIFxnk/bass.mp3"
 *                         drums:
 *                            type: string
 *                            example: "/media/HsLqNFIFxnk/drums.mp3"
 *                         other:
 *                            type: string
 *                            example: "/media/HsLqNFIFxnk/other.mp3"
 *
 *          '500':
 *            description: Server encountered a problem
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: string
 *                      example: "Internal Server Error"
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
analyzeRouter.post("/split/:id", check, async (req, res) => {
  const result = await fetch(`http://localhost:3000/spleeter`, {
    method: "POST",
    body: JSON.stringify({
      id: req.params.id,
      username: (req.user as User).username,
    }),
    headers: {
      "Content-Type": "application/json",
      //@ts-ignore
      authorization: req.token,
    },
  })
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error: error.message }));
});

export default analyzeRouter;
