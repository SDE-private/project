import express from "express";
import youtubedl from "youtube-dl-exec";


const ytDlController = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const url: string = req.body.url;
        if (!url) {
            return res.status(400).send({ error: "link is required" });
        }   

        youtubedl(url, {
            dumpSingleJson: true,
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: 0,
            output: "%(title)s.%(ext)s",
            
        }).then((output: any) => console.log(output));

        res.status(200).send("Video scaricato correttamente");

    } catch (error) {
        console.log(error)
        return res.status(500).send("Non sono riuscito a scaricare il video al link specificato");
    }
};

export default ytDlController;