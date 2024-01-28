import express from "express";
import youtubedl, { Payload } from "youtube-dl-exec";
import { Song, addSong, connectToDatabase} from "../database/database.js";
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

        let ytdlVideoDownload: Promise<Payload> = youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: 5,
            output: "song.%(ext)s",
        });

        let ytdlInfo: Payload = await youtubedl(url, {
            dumpSingleJson: true, //se true, il video non viene scaricato. Vengono solo restituite le informazioni
            extractAudio: true,
            audioFormat: "mp3",
        });

        console.log("ytdlOutput TITLE: " + ytdlInfo.title); //questo funziona solo se dumpSingleJson è true, altrimenti è undefined

        await ytdlVideoDownload;
        console.log("Video downloaded successfully");
        // res.status(200).send("Video downloaded successfully");

        //---------------------------------- THE FOLLOWING PART SHOULDN'T BE HERE ----------------------------------
        if (ytdlInfo.title === undefined) {
            console.log("yt-dl error: title is undefined");
            return res.status(500).send("Internal error");
        }
        //convert the mp3 video into Binary Data
        const base_path: string = "/app"
        //const audio_path: string = base_path + "/" + ytdlOutput.title + ".mp3";
        const audio_path: string = base_path + "/song.mp3";

        try {
            const audio_data: Buffer = fs.readFileSync(audio_path);
            console.log("Mp3 song read successfully")
            //transform the video into a song
            const song: Song = {
                title: ytdlInfo.title,
                upload_timestamp: Date.now(),
                song: audio_data
            }

            //add the song to the user's library
            const username = req.body.username;

            await connectToDatabase();
            if (await addSong(username, song))
                console.log("Song added to the user's library");
            else 
                console.log("Error adding the song to the user's library");

            //delete the video
            console.log("Deleting video");
            fs.rm(audio_path, (err) => {
                if (err) {
                    console.log("Error deleting the video: " + err);
                }
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("Something went wrong reading the video...");
        }
        //---------------------------------- THE PREVIOUS PART SHOULDN'T BE HERE ----------------------------------

        return res.status(200).send("Video downloaded successfully");

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send("Something went wrong downloading the video...");
    }
};


export default ytDlController;