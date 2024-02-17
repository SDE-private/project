import 'package:flutter/material.dart';

final AddSongDialog = (BuildContext ctx) => AlertDialog(
  title: const Text("Add song"),
  content: TextField(
    onChanged: (val) { print(val); },
    controller: TextEditingController(),
  ),
  actions: [
    MaterialButton(
      child: const Text("Add"),
      onPressed: () {
        // TODO: download the song
        Navigator.pop(ctx);
      }
    )
  ],
);