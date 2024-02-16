import { Router } from "express";
import { User } from "../../business/adapters/db_controller";
import check from "../middleware/check.js";

const songsRouter = Router();

songsRouter.get("/songs", check, (req, res) => {
  const songs = (req.user as User).songs;
  res.json(songs);
});


songsRouter.post("/download", check, async (req, res) => {
  const uname = (req.user as User).username;

  try {
    const url = 'http://localhost:3000/yt-dl'; 
    const data = { url: req.body.url, username: uname}; // Dati da inviare nella richiesta POST, sostituisci con i tuoi dati
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assicurati di impostare l'header corretto per i dati che stai inviando
      },
      body: JSON.stringify(data), // Converti i dati in formato JSON prima di inviarli
    };

    console.log("Invio della richiesta al server:", data, options);

    const response = await fetch(url, options); // Effettua la richiesta POST
    const responseData = await response; // Estrai i dati JSON dalla risposta

    console.log("Risposta dal server:", responseData);
    res.status(200)
  } catch (error) {
    console.error("Si è verificato un errore durante la richiesta:", error);
    res.status(500)
  }
});

songsRouter.get("/suggestion/:id", check, async (req, res) => {
  const id = req.params.id;
  const songs = (req.user as User).songs;
  const song = songs.find((song) => song.id === id);

  if (!song) {
    res.status(404).json({ message: "Song not found" });
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

    res.json(responseData);
  }
});

export default songsRouter;
