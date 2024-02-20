class SimilarSong {

  String song_name, artist, url;

  SimilarSong(this.song_name, this.artist, this.url);

  factory SimilarSong.fromJSON(Map<String, dynamic> json) {
    return SimilarSong(
      json['song_name'],
      json['artist'],
      json['url']
    );
  }

}