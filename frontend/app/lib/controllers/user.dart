import 'dart:convert';

import 'package:frontend/classes/song.dart';
import 'package:http/http.dart' as http;

class UserController {

  String library_base_url = "http://localhost:3001/songs-library";
  String analyze_base_url = "http://localhost:3001/analyze";
  Map<String, String> headers;

  UserController(this.headers);

  Future<List<Song>> get_songs() async {
    String url = "$library_base_url/songs";
    Uri uri = Uri.parse(url);
    final response = await http.get(uri, headers: headers);
    if (response.statusCode == 200) {
      final json_body = jsonDecode(response.body) as List<dynamic>;
      List<Song> ret = json_body.map((e) => Song.fromJSON(e as Map<String, dynamic>)).toList();
      return ret;
    }
    else {
      return [];
    }
  }

  Future<bool> download_song(String url_to_download) async {
    String url = "$library_base_url/download";
    Uri uri = Uri.parse(url);
    final body = {
      "url": url_to_download
    };
    final json_body = jsonEncode(body);
    final response = await http.post(uri, headers: headers, body: json_body);
    print(response.body);
    if (response.statusCode == 200) {
      return true;
    }
    else {
      return false;
    }
  }

  Future<bool> split_song(String song_id) async {
    String url = "$analyze_base_url/split/$song_id";
    Uri uri = Uri.parse(url);
    final response = await http.post(uri, headers: headers);
    print(response.body);
    if (response.statusCode == 200) {
      return true;
    }
    else {
      return false;
    }
  }

}