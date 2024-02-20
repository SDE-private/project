import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:frontend/classes/instruments.dart';

class Multiplayer with ChangeNotifier {
  late List<Instrument> instruments;
  Duration duration = const Duration(days: 1);
  Duration current_position = Duration.zero;
  bool is_playing = false, is_pause = true;
  
  Multiplayer(String song_id) {
    instruments = [
      // Instrument("bass", FontAwesomeIcons.bars, "bass.wav"),
      Instrument("vocals", FontAwesomeIcons.microphone, "http://localhost/static/$song_id/vocals.mp3"),
      // Instrument("drums", FontAwesomeIcons.drum, "drums.wav"),
      Instrument("accompaniment", FontAwesomeIcons.ellipsis, "http://localhost/static/$song_id/accompaniment.mp3"),
      // Instrument("piano", FontAwesomeIcons.music, "piano.wav"),
    ];

    instruments[0].player.setSource(UrlSource(instruments[0].pathfile));
    for (final ins in instruments) {
      if (ins.enabled) {
        ins.player.setSource(UrlSource(ins.pathfile));
      }
    }
  }

  double get_slider_value() {
    if (current_position.inMilliseconds > 0 && current_position.inMilliseconds < duration.inMilliseconds) {
      return current_position.inMilliseconds / duration.inMilliseconds;
    }
    else {
      return 0.0;
    }
  }

  void play_music() async {
    if (!is_playing) {
      for (final ins in instruments) {
        if (ins.enabled) {
          ins.player.play(UrlSource(ins.pathfile));
        }
      }
      is_playing = true;
      instruments[1].player.onPositionChanged.listen((pos) {
        current_position = pos;
        notifyListeners();
      });
    }
    else {
      for (final ins in instruments) {
        if (ins.enabled) {
          // await ins.player.seek(Duration(seconds: 30));
          ins.player.resume();
        }
      }
    }
    is_pause = false;
    notifyListeners();
  }

  void pause_music() {
    for (final ins in instruments) {
      if (ins.enabled) {
        ins.player.pause();
      }
    }
    is_pause = true;
    notifyListeners();
  }

  void seek_music(double value) {
    final new_position = value * duration.inMilliseconds;
    for (final ins in instruments) {
      if (ins.enabled) {
        ins.player.seek(Duration(milliseconds: new_position.toInt()));
      }
    }
    current_position = Duration(milliseconds: new_position.toInt());
    notifyListeners();
  }

}