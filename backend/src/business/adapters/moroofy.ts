import express from "express";

type MoroofyRequest = {
  title: string;
};

type MoroofyResponse = Array<{
  song_name: string;
  artist_name: string;
  url: string;
}>;

const moroofyController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // convert body to MoroofyRequest
    const data: MoroofyRequest = req.body;
    if (!data.title) {
      return res.status(400).json({ error: "title is required" });
    }

    console.log(data.title);

    const libraryApi = `https://itunes.apple.com/search?term=${encodeURIComponent(
      data.title.trim(),
    )}&media=music&entity=song&limit=1`;

    // fetch library
    const libraryResponse = await fetch(libraryApi).then((res) => res.json());

    // return first result
    const track_id = libraryResponse.results[0].trackId;
    if (!track_id) {
      return res.status(404).json({ error: "song not found" });
    }

    // return result
    const request = JSON.stringify({
      "0": { json: { song_id: track_id, fuzzySearchCount: 0 } },
    });
    const similarApi = `https://maroofy.com/api/trpc/songs.findSimilarSongs?batch=1&input=${request}`;
    const similarResponse = await fetch(similarApi).then((res) => res.json());

    if (!similarResponse) {
      return res.status(400).json({ error: "similar songs not found" });
    }

    const similarData = similarResponse[0].result.data.json;
    const top10 = similarData.slice(0, 10);
    const top10Response: MoroofyResponse = top10.map((song: any) => ({
      song_name: song.name,
      artist_name: song.artist_display_name,
      url: song.preview_url,
    }));

    res.status(200).json(top10Response);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default moroofyController;
