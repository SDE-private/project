import { Router } from "express";
import check from "../middleware/check.js";
import { User } from "../../business/adapters/db_controller.js";

const analyzeRouter = Router();

/**
 * @swagger
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
 *                            example: "/media/HsLqNFIFxnk/accompaniment.wav"
 *                         vocals:       
 *                            type: string       
 *                            example: "/media/HsLqNFIFxnk/vocals.wav"
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
 */
analyzeRouter.post("/split/:id", check, async (req, res) => {
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