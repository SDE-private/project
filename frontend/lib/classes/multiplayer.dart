import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:frontend/classes/instruments.dart';

class Multiplayer with ChangeNotifier {
  late List<Instrument> instruments;
  Duration duration = const Duration(days: 1);
  Duration current_position = Duration.zero;
  bool is_playing = false, is_pause = true;
  
  Multiplayer() {
    instruments = [
      Instrument("bass", FontAwesomeIcons.bars, "bass.wav"),
      Instrument("vocals", FontAwesomeIcons.microphone, "vocals.wav"),
      Instrument("drums", FontAwesomeIcons.drum, "drums.wav"),
      Instrument("others", FontAwesomeIcons.ellipsis, "other.wav"),
      Instrument("piano", FontAwesomeIcons.music, "piano.wav"),
    ];

    instruments[0].player.onDurationChanged.listen((dur) {
      duration = dur;
      notifyListeners();
    });

    instruments[0].player.setSource(AssetSource(instruments[0].pathfile));
    instruments[0].player.getDuration().then((value) {
      if (value != null) {
        duration = value;
      }
    });
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
          ins.player.play(AssetSource(ins.pathfile));
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

  void update_players(double value) async {
    final position_millis = value * duration.inMilliseconds;
    current_position = Duration(milliseconds: position_millis.round());
    print("damn $value");
    for (final ins in instruments) {
      await ins.player.seek(current_position);
    }
    notifyListeners();
  }
}