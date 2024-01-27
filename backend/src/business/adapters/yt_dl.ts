import express from "express";
import youtubedl, { Payload } from "youtube-dl-exec";
import { Song, addSong} from "../database/database.js";
import fs from "fs";

const ytDlController = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const url: string = req.body.url;
        console.log("url taken from request: " + url)
        if (!url) {
            console.log("yt-dl error: link is required")
            return res.status(400).send("Link is required");
        }
        else if (url.indexOf("https://www.youtube.com/watch?v=") !== 0) {
            console.log("yt-dl error: url is not valid");
            return res.status(400).send("Url is not valid");
        }

        // se decidiamo di togliere await, ytdlOutput sarà una Promise<Payload>
        let ytdlOutput: Payload = await youtubedl(url, {
            dumpSingleJson: true,
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: 0,
            output: "%(title)s.%(ext)s",
        });

        console.log("ytdlOutput TITLE: " + ytdlOutput.title);

        console.log("Video downloaded successfully");
        res.status(200).send("Video downloaded successfully");

        //---------------------------------- THE FOLLOWING PART SHOULDN'T BE HERE ----------------------------------
        if (ytdlOutput.title === undefined) {
            console.log("yt-dl error: title is undefined");
            return res.status(500).send("Internal error");
        }
        // //convert the mp3 video into Binary Data
        const base_path: string = "/app"
        const audio_path: string = base_path + "/" + ytdlOutput.title + ".mp3";
        const audio_data: Buffer = fs.readFileSync(audio_path);
        //transform the video into a song
        const song: Song = {
            title: ytdlOutput.title,
            upload_timestamp: Date.now(),
            song: audio_data
        }

        //add the song to the user's library
        const username = req.body.username;
        addSong(username, song);
        //---------------------------------- THE PREVIOUS PART SHOULDN'T BE HERE ----------------------------------

        return res;

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send("Something went wrong downloading the video...");
    }
};


export default ytDlController;