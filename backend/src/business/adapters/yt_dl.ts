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
            return res.status(400).send({ error: "link is required" });
        }

        // rischio con await di bloccare il server
        await youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: 0,
            output: "%(title)s.%(ext)s",
        }).then(output => console.log(output));

        res.status(200).send("Video scaricato correttamente");

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send("Non sono riuscito a scaricare il video al link specificato");
    }
};


export default ytDlController;