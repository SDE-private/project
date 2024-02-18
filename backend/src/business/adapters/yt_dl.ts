import express from "express";
import youtubedl, { Payload } from "youtube-dl-exec";
import { addSong, connectToDatabase, Song } from "./db_controller.js";
import fs from "fs";
import { User } from "./db_controller.js";

const basePath: string = "/media";

//---------------------controller---------------------

const ytDlController = async (req: express.Request, res: express.Response) => {
  try {
    //const username: string = req.body.username; //old version without authentication
    const username: string = (req.user as User).username;
    const url: string = req.body.url;
    const errorMessage = checkUrl(url);
    if (errorMessage) {
      res.status(400).json({error: errorMessage});
      return;
    }

    //getting video info (doesn't download the video)
    const ytdlInfo: Payload = await youtubedl(url, {
      dumpSingleJson: true, //se true, il video non viene scaricato. Vengono solo restituite le informazioni
      extractAudio: true,
      audioFormat: "mp3",
    });

    console.log("ytdlOutput TITLE: " + ytdlInfo.title); //questo funziona solo se dumpSingleJson è true, altrimenti è undefined
    console.log("video duration: " + ytdlInfo.duration);

    //check if the video is already downloaded
    if (!alreadyDownloaded(ytdlInfo.id)) {
      //check title and duration of the requested video
      if (!validVideoInfo(ytdlInfo)) {
        console.log("Invalid video reference");
        return res.status(400).json({error: "Invalid video reference"});
      }

      let ytdlVideoDownload: Promise<Payload>;
      //start downloading the video
      ytdlVideoDownload = youtubedl(url, {
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: 5,
        output: basePath + "/" + ytdlInfo.id + ".%(ext)s",
      });

      await ytdlVideoDownload;
      console.log("Video downloaded successfully");
    } else {
      console.log("Video already downloaded. Skipping download...");
    }

    //---------------------------------- THE FOLLOWING PART SHOULDN'T BE HERE ----------------------------------

    //create the song obj
    const song: Song = {
      id: ytdlInfo.id,
      title: ytdlInfo.title,
      upload_timestamp: Date.now(),
      yt_url: url,
      analyzed: false,
    };

    //add the song to the user's library
    await connectToDatabase();
    if (await addSong(username, song))
      console.log("Song added to the user's library");
    else console.log("Error adding the song to the user's library");

    //---------------------------------- THE PREVIOUS PART SHOULDN'T BE HERE ----------------------------------

    return res.status(200).json(song);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({error: "Something went wrong downloading the video..."});
  }
};

//---------------------functions---------------------

function checkUrl(url: string) {
  console.log("Analizing URL: " + url);
  if (!url) {
    console.log("yt-dl error: link is required");
    return "Link is required";
  } else if (url.indexOf("https://www.youtube.com/watch?v=") !== 0) {
    console.log("yt-dl error: url is not valid");
    return "Url is not valid";
  } else {
    return null;
  }
}

//---------------

function validVideoInfo(ytdlInfo: Payload) {
  if (ytdlInfo.title === undefined) {
    console.log("yt-dl error: title is undefined");
    return false;
  } else if (ytdlInfo.duration > 600) {
    console.log("yt-dl error: video too long");
    return false;
  }
  return true;
}

//---------------

function alreadyDownloaded(videoId: string) {
  return fs.existsSync(basePath + "/" + videoId + ".mp3");
}

//---------------

export function getSongPath(songId: string) {
  return basePath + "/" + songId + ".mp3";
}

//---------------

export default ytDlController;
