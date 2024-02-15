import 'package:flutter/material.dart';
import 'package:frontend/classes/song.dart';
import 'package:frontend/providers/user.dart';
import 'package:frontend/ui/alerts/add_song.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Library"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: _do_logout
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.large(
        onPressed: _open_add_popup,
        child: const Icon(Icons.add)
      ),
      body: Center(
        child: SizedBox(
          width: MediaQuery.of(context).size.width * 0.5,
          child: ListView.builder(
              itemCount: SONGS.length,
              itemBuilder: (ctx, index) {
                return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(SONGS[index].name),
                      IconButton(
                          onPressed: () => _open_song_page(index),
                          icon: const Icon(Icons.call_split_outlined)
                      )
                    ]
                );
              }
          ),
        )
      )
    );
  }

  void _open_add_popup() {
    showDialog(context: context, builder: (ctx) => AddSongDialog(context));
  }

  void _open_song_page(int index) {

  }

  void _do_logout() {
    context.read<UserProvider>().logout();
    context.go('/login');
  }
}
