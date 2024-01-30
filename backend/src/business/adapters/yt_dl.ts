import express from "express";
import youtubedl, { Payload } from "youtube-dl-exec";
import { Song, addSong, connectToDatabase} from "../database/database.js";
import fs from "fs";

const basePath: string = "/media";

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
                output: basePath+"/"+ytdlInfo.id+".%(ext)s",
            });

        await ytdlVideoDownload;
        console.log("Video downloaded successfully");

        //---------------------------------- THE FOLLOWING PART SHOULDN'T BE HERE ----------------------------------

        //create the song obj
        const song: Song = { id: ytdlInfo.id, 
                             title: ytdlInfo.title, 
                             upload_timestamp: Date.now(), 
                             yt_url: url };
        
        //add the song to the user's library
        await connectToDatabase();
        if (await addSong(username, song))
            console.log("Song added to the user's library");
        else 
            console.log("Error adding the song to the user's library");

        //---------------------------------- THE PREVIOUS PART SHOULDN'T BE HERE ----------------------------------

        return res.status(200).send("Video downloaded successfully");

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send("Something went wrong downloading the video...");
    }
};

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



export default ytDlController;