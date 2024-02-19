import 'package:flutter/material.dart';
import 'package:frontend/providers/user.dart';
import 'package:provider/provider.dart';

final AddSongDialog = (BuildContext ctx) => AlertDialog(
  title: const Text("Add song"),
  content: TextField(
    onChanged: (val) { print(val); },
    controller: TextEditingController(),
  ),
  actions: [
    MaterialButton(
      child: const Text("Download"),
      onPressed: () {
        print("das");
        // ctx.read<UserProvider>().ctrl!.download_song("https://www.youtube.com/watch?v=kJQP7kiw5Fk");
        // Navigator.pop(ctx);
      }
    )
  ],
);