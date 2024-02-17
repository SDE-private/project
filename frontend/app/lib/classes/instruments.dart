import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';

class Instrument {
  String name;
  IconData icon;
  String pathfile;
  bool enabled = true;
  final player = AudioPlayer();
  
  Instrument(this.name, this.icon, this.pathfile);

  void toggle() {
    enabled = !enabled;
    player.setVolume(enabled ? 1 : 0);
  }
}

