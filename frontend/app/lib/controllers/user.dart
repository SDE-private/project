import 'package:http/http.dart' as http;

class UserController {

  String base_url = "http://localhost:3000";
  Map<String, String> headers;

  UserController(this.headers);

  Future<void> get_songs() {
    String url = "$base_url";
    Uri uri = Uri.parse(url);
    return http.get(uri, headers: headers);
  }

  Future<void> split_song(String song_id) {
    // TODO: put the right url
    String url = "$base_url/idk/$song_id";
    Uri uri = Uri.parse(url);
    return http.post(uri, headers: headers);
  }

}