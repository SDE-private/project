import express from "express";
import youtubedl from "youtube-dl-exec";
//const youtubedl = require("youtube-dl-exec");
import logger from 'progress-estimator'
import { ChildProcess } from "child_process";


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
        await youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: 0,
            output: "%(title)s.%(ext)s",
        }).then(output => console.log(output));

        res.status(200).send("Video downloaded successfully");

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send("Something went wrong downloading the video...");
    }
};


export default ytDlController;