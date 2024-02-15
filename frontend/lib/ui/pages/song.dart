import 'package:flutter/material.dart';
import 'package:frontend/classes/instruments.dart';
import 'package:frontend/classes/multiplayer.dart';

class SongPage extends StatefulWidget {
  const SongPage({super.key});

  @override
  State<SongPage> createState() => _SongPageState();
}

class _SongPageState extends State<SongPage> {
  Multiplayer multiplayer = Multiplayer();

  void _toggle_instrument(Instrument ins) {
    setState(() {
      ins.toggle();
    });
  }

  @override
  void initState() {
    super.initState();
    
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      mainAxisSize: MainAxisSize.max,
      children: [
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: multiplayer.instruments.map(
            (ins) => Card(
              child: Row(
                children: [
                  Column(
                    children: [
                      Icon(ins.icon, size: 50),
                      Switch(
                        value: ins.enabled,
                        onChanged: (v) => _toggle_instrument(ins)
                      )
                    ]
                  ),
                  Text(ins.name),
                ]
              ) 
            )
          ).toList() as List<Widget>
        ),
        ListenableBuilder(
          listenable: multiplayer,
          builder: (BuildContext context, Widget? child) {
            print(multiplayer.current_position);
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      key: const Key('play_button'),
                      onPressed: multiplayer.is_pause ? multiplayer.play_music : null,
                      iconSize: 48.0,
                      icon: const Icon(Icons.play_arrow),
                    ),
                    IconButton(
                      key: const Key('pause_button'),
                      onPressed: multiplayer.is_pause ? null : multiplayer.pause_music,
                      iconSize: 48.0,
                      icon: const Icon(Icons.pause),
                    ),
                  ],
                ),
                Slider(
                  onChanged: (value) => {},
                  onChangeEnd: (value) => multiplayer.update_players(value),
                  value: multiplayer.get_slider_value(),
                )
              ],
            );
          }
        )
      ]
    );
  }
}