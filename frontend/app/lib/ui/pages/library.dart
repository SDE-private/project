import 'package:flutter/material.dart';
import 'package:frontend/classes/song.dart';
import 'package:frontend/providers/user.dart';
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
    if (!context.read<UserProvider>().is_logged()) {
      context.go('/login');
    }
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: const Text("Library"),
          actions: [
            IconButton(
                icon: const Icon(Icons.logout),
                tooltip: 'Logout',
                onPressed: _do_logout),
          ],
        ),
        floatingActionButton: FloatingActionButton.large(
            onPressed: _open_add_popup, child: const Icon(Icons.add)),
        body: Center(
            child: SizedBox(
          width: MediaQuery.of(context).size.width * 0.5,
          child: FutureBuilder(
              future: context.read<UserProvider>().ctrl!.get_songs(),
              builder: (BuildContext ctx, AsyncSnapshot<List<Song>> snapshot) {
                if (snapshot.hasData) {
                  final songs = snapshot.data!;
                  return ListView.builder(
                      itemCount: songs.length,
                      itemBuilder: (ctx, index) {
                        return Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(songs[index].title),
                              songs[index].analyzed
                                  ? IconButton(
                                      onPressed: () =>
                                          _open_song_page(songs[index]),
                                      icon: const Icon(Icons.audiotrack))
                                  : IconButton(
                                      onPressed: () =>
                                          _analyze_song(songs, index),
                                      icon:
                                          const Icon(Icons.call_split_outlined))
                            ]);
                      });
                } else if (snapshot.hasError) {
                  print(snapshot.error);
                  return Text("Errors");
                } else {
                  return CircularProgressIndicator();
                }
              }),
        )));
  }

  void _open_add_popup() {
    showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
              title: const Text("Add song"),
              content: TextField(
                onChanged: (val) {
                  print(val);
                },
                controller: TextEditingController(),
              ),
              actions: [
                MaterialButton(
                    child: const Text("Download"),
                    onPressed: () {
                      Navigator.pop(context);
                    })
              ],
            ));
  }

  // pass the songs and the index
  void _analyze_song(List<Song> songs, int index) async {
    final song = songs[index];
    print(song.yt_url);
    final res = await context.read<UserProvider>().ctrl!.split_song(song.id);
    if (res == true) {
      print('analyzed');
      setState(() {
        songs[index].analyzed = true;
      });
    } else {
      print('not analyzed');
    }
  }

  void _open_song_page(Song song) {
    context.go('/song', extra: song);
    // context.read<UserProvider>().ctrl!.download_song("https://www.youtube.com/watch?v=kJQP7kiw5Fk");
  }

  void _do_logout() {
    context.read<UserProvider>().logout();
    context.go('/login');
  }
}
