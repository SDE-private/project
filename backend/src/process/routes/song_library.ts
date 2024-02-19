import { Router } from "express";
import { User } from "../../business/adapters/db_controller.js";
import { check } from "../../business/middleware/check.js";

const songsRouter = Router();

// "id":"kJQP7kiw5Fk","title":"Luis Fonsi - Despacito ft. Daddy Yankee","upload_timestamp":1708093435972,"yt_url":"https://www.youtube.com/watch?v=kJQP7kiw5Fk","analyzed":false,"_id":"65cf6ffc2ba7d5496fbd2478"}
/**
 * @swagger
 * /songs-library/songs:
 *    get:
 *      summary: Retrieve the user's songs in the library
 *      description: Retrieve the user's songs in the library
 *      security:
 *        - tokenAuth: []
 *      tags:
 *        - Songs Library
 *      responses:
 *        '200':
 *          description: A list of the user's songs
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: ID of the song
 *                      example: "kJQP7kiw5Fk"
 *                    title:
 *                      type: string
 *                      description: Title of the song
 *                      example: "Luis Fonsi - Despacito ft. Daddy Yankee"
 *                    upload_timestamp:
 *                      type: number
 *                      description: Timestamp of the upload
 *                      example: 1708093435972
 *                    yt_url:
 *                      type: string
 *                      description: YouTube URL of the song
 *                      example: "https://www.youtube.com/watch?v=kJQP7kiw5Fk"
 *                    analyzed:
 *                      type: boolean
 *                      description: Whether the song has been analyzed by spleeter
 *                      example: false
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
songsRouter.get("/songs", check, (req, res) => {
  const songs = (req.user as User).songs;
  res.json(songs);
});

/**
 * @swagger
 * /songs-library/download:
 *   post:
 *     summary: Scarica una canzone
 *     description: Questo endpoint consente di scaricare una canzone fornendo l'URL di youtube della canzone desiderata.
 *     security:
 *       - tokenAuth: []
 *     tags:
 *       - Songs Library
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL della canzone da scaricare
 *                 example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *             required:
 *               - url
 *     responses:
 *       '200':
 *         description: Canzone scaricata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "HsLqNFIFxnk"
 *                 title:
 *                   type: string
 *                   example: "PoP_X 'Io Centro Con I Missili'"
 *                 upload_timestamp:
 *                   type: integer
 *                   example: 1708093435972
 *                 yt_url:
 *                   type: string
 *                   example: "https://www.youtube.com/watch?v=HsLqNFIFxnk"
 *                 analyzed:
 *                   type: boolean
 *                   example: false
 *       '500':
 *         description: Si è verificato un errore durante la richiesta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Messaggio di conferma
 *                   example: "Canzone scaricata con successo"
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
songsRouter.post("/download", check, async (req, res) => {
  const uname = (req.user as User).username;

  try {
    const url = "http://localhost:3000/yt-dl";
    const data = { url: req.body.url, username: uname }; // Dati da inviare nella richiesta POST, sostituisci con i tuoi dati
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assicurati di impostare l'header corretto per i dati che stai inviando
        //@ts-ignore
        authorization: req.token,
      },
      body: JSON.stringify(data), // Converti i dati in formato JSON prima di inviarli
    };

    console.log("Invio della richiesta al server:", data, options);
    const response = await fetch(url, options); // Effettua la richiesta POST

    const response_json = await response.json();
    console.log("Risposta dal server:", response_json);
    res.status(200).json(response_json);
  } catch (error) {
    console.error("Si è verificato un errore durante la richiesta:", error);
    res
      .status(500)
      .json({ error: "Si è verificato un errore durante la richiesta" });
  }
});

/**
 * @swagger
 *  /songs-library/suggestion/{id}:
 *     get:
 *       tags:
 *         - Songs Library
 *       summary: Retrieve a list of similar songs
 *       description: Retrieve a list of similar songs given a song title
 *       security:
 *        - tokenAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             description: ID of the song in the database
 *             example: "mWCIbuJBHd8"
 *       responses:
 *          '200':
 *            description: A list of similar songs
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      song_name:
 *                        type: string
 *                      artist_name:
 *                        type: string
 *                      url:
 *                        type: string
 *          '404':
 *            description: Song not found
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: string
 *                      example: "Song not found"
 *          '500':
 *            description: Server encountered a problem
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: string
 *                      example: "Server encountered a problem"
 *
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: apiKey
 *       in: headers
 *       name: authorization
 */
songsRouter.get("/suggestion/:id", check, async (req, res) => {
  try {
    const id = req.params.id;
    const songs = (req.user as User).songs;
    const song = songs.find((song) => song.id === id);

    if (!song) {
      res.status(404).json({ error: "Song not found" });
    } else {
      const url = "http://localhost:3000/maroofy";
      const data = { title: song.title }; // Dati da inviare nella richiesta POST, sostituisci con i tuoi dati
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assicurati di impostare l'header corretto per i dati che stai inviando
        },
        body: JSON.stringify(data), // Converti i dati in formato JSON prima di inviarli
      };

      const response = await fetch(url, options); // Effettua la richiesta POST
      // console.log("Risposta dal server:", await response);
      const responseData = await response.json(); // Estrai i dati JSON dalla risposta

      res.status(200).json(responseData);
    }
  } catch (error) {
    res.status(500).json({ error: "Server encountered a problem" });
  }
});

export default songsRouter;
