class Song {
  String id, title, yt_url;
  bool analyzed;

  Song(this.id, this.title, this.yt_url, this.analyzed);

  factory Song.fromJSON(Map<String, dynamic> json) {
    return Song(
      json['id'],
      json['title'],
      json['yt_url'],
      json['analyzed']
    );
  }
}