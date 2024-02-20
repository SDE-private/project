import 'package:flutter/material.dart';
import 'package:frontend/classes/instruments.dart';
import 'package:frontend/classes/multiplayer.dart';
import 'package:frontend/classes/song.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/user.dart';

class SongPage extends StatefulWidget {
  Song song;

  SongPage({super.key, required this.song});

  @override
  State<SongPage> createState() => _SongPageState();
}

class _SongPageState extends State<SongPage> {
  late Multiplayer multiplayer;

  void _toggle_instrument(Instrument ins) {
    setState(() {
      ins.toggle();
    });
  }

  @override
  void initState() {
    super.initState();
    multiplayer = Multiplayer(widget.song.id);
  }

  @override
  Widget build(BuildContext context) {
    if (!context.read<UserProvider>().is_logged()) {
      context.read<UserProvider>().login();
    }
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: const Text("Song"),
          actions: [
            IconButton(
                icon: const Icon(Icons.logout),
                tooltip: 'Logout',
                onPressed: _do_logout),
          ],
        ),
        body: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisSize: MainAxisSize.max,
            children: [
              Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: multiplayer.instruments
                      .map((ins) => Card(
                              child: Row(children: [
                            Column(children: [
                              Icon(ins.icon, size: 50),
                              Switch(
                                  value: ins.enabled,
                                  onChanged: (v) => _toggle_instrument(ins))
                            ]),
                            Text(ins.name),
                          ])))
                      .toList() as List<Widget>),
              ListenableBuilder(
                  listenable: multiplayer,
                  builder: (BuildContext context, Widget? child) {
                    // check if the song is at the end
                    if (multiplayer.current_position.inMilliseconds >=
                        multiplayer.duration.inMilliseconds) {
                      print("Song ended");
                      multiplayer.pause_music();
                      multiplayer.current_position = Duration.zero;
                    }
                    return Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              key: multiplayer.is_pause
                                  ? const Key('play_button')
                                  : const Key('pause_button'),
                              onPressed: multiplayer.is_pause
                                  ? multiplayer.play_music
                                  : multiplayer.pause_music,
                              iconSize: 48.0,
                              icon: multiplayer.is_pause
                                  ? const Icon(Icons.play_arrow)
                                  : const Icon(Icons.pause),
                            ),
                          ],
                        )
                      ],
                    );
                  })
            ]));
  }

  void _do_logout() {
    context.read<UserProvider>().logout();
    context.go('/login');
  }
}
