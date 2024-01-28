import express from "express";
import youtubedl, { Payload } from "youtube-dl-exec";
import { Song, addSong, connectToDatabase} from "../database/database.js";
import fs from "fs";

const audioPath : string = "/app/song.mp3";

//---------------------functions---------------------

function checkUrl(url: string, res: express.Response) {
        console.log("Analizing URL: " + url)
    if (!url) {
        console.log("yt-dl error: link is required")
        return res.status(400).send("Link is required");
    }
    else if (url.indexOf("https://www.youtube.com/watch?v=") !== 0) {
        console.log("yt-dl error: url is not valid");
        return res.status(400).send("Url is not valid");
    }
}

//---------------

function validVideoInfo(ytdlInfo: Payload, res: express.Response) {
    if (ytdlInfo.title === undefined) {
        console.log("yt-dl error: title is undefined");
        return false;
    }
    else if (ytdlInfo.duration > 600) {
        console.log("yt-dl error: video too long");
        return false;
    }
    return true;
}

//---------------

function fromMP3toSong(mp3Path: string, songTitle: string) {
    try {
        const audio_data: Buffer = fs.readFileSync(mp3Path);

        console.log("Mp3 song read successfully")
        //transform the video into a song
        return {
            title: songTitle,
            upload_timestamp: Date.now(),
            song: audio_data
        }
    } catch (error) {
        console.log("Error reading the mp3 file: " + error);
    }
    return null;
}

//---------------------controller---------------------

const ytDlController = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const username: string = req.body.username;
        const url: string = req.body.url;
        checkUrl(url, res);
        
        //getting video info (doesn't download the video)
        let ytdlInfo: Payload = await youtubedl(url, {
            dumpSingleJson: true, //se true, il video non viene scaricato. Vengono solo restituite le informazioni
            extractAudio: true,
            audioFormat: "mp3",
        });

        console.log("ytdlOutput TITLE: " + ytdlInfo.title); //questo funziona solo se dumpSingleJson è true, altrimenti è undefined
        console.log("video duration: " + ytdlInfo.duration);

        //check title and duration of the requested video
        if (!validVideoInfo(ytdlInfo, res)) 
            return res.status(400).send("Invalid video reference");

        let ytdlVideoDownload: Promise<Payload>;
            //start downloading the video
            ytdlVideoDownload = youtubedl(url, {
                extractAudio: true,
                audioFormat: "mp3",
                audioQuality: 5,
                output: "song.%(ext)s",
            });

        await ytdlVideoDownload;
        console.log("Video downloaded successfully");
        // res.status(200).send("Video downloaded successfully");

        //---------------------------------- THE FOLLOWING PART SHOULDN'T BE HERE ----------------------------------

        //read the downloaded video
        const song: Song|null = fromMP3toSong(audioPath, ytdlInfo.title);
        if(song === null)
            return res.status(500).send("Error converting the video to a song");
        
        //add the song to the user's library
        await connectToDatabase();
        if (await addSong(username, song))
            console.log("Song added to the user's library");
        else 
            console.log("Error adding the song to the user's library");

        //delete the video
        console.log("Deleting video");
        fs.rm(audioPath, (err) => {
            if (err) {
                console.log("Error deleting the video: " + err);
            }
        })
        
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