class SimilarSong {

  String song_name, artist_name, url;

  SimilarSong(this.song_name, this.artist_name, this.url);

  factory SimilarSong.fromJSON(Map<String, dynamic> json) {
    return SimilarSong(
      json['song_name'],
      json['artist_name'],
      json['url']
    );
  }

}