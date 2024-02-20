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
  late List<Song> songs;
  @override
  Widget build(BuildContext context) {
    if (!context.read<UserProvider>().is_logged()) {
      context.read<UserProvider>().login();
    }
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: const Text("Library",
              style: TextStyle(fontWeight: FontWeight.bold)),
          actions: [
            IconButton(
                icon: const Icon(Icons.logout),
                tooltip: 'Logout',
                onPressed: _do_logout),
          ],
        ),
        floatingActionButton: FloatingActionButton.large(
            onPressed: () => _open_add_popup(songs), child: const Icon(Icons.add)),
        body: Center(
            child: SizedBox(
          width: MediaQuery.of(context).size.width * 0.5,
          child: FutureBuilder(
              future: context.read<UserProvider>().ctrl!.get_songs(),
              builder: (BuildContext ctx, AsyncSnapshot<List<Song>> snapshot) {
                if (snapshot.hasData) {
                  songs = snapshot.data!;
                  return ListView.builder(
                      itemCount: songs.length,
                      itemBuilder: (ctx, index) {
                        return Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(songs[index].title),
                              ButtonBar(children: [
                                songs[index].analyzed
                                    ? IconButton(
                                        onPressed: () =>
                                            _open_song_page(songs[index]),
                                        icon: const Icon(Icons.audiotrack))
                                    : IconButton(
                                        onPressed: () =>
                                            _analyze_song(songs[index]),
                                        icon: const Icon(
                                            Icons.call_split_outlined)),
                                IconButton(
                                  onPressed: () => _search_similar(songs[index]),
                                  icon: const Icon(Icons.manage_search),
                                )
                              ])
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

  void _open_add_popup(List<Song> songs) {
    final txt_ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
            title: const Text("Paste YouTube Link"),
            content: TextField(
              onChanged: (val) {
                print(val);
              },
              controller: txt_ctrl,
            ),
            actions: [
              MaterialButton(
                  child: const Text("Download"),
                  onPressed: () async {
                    final song = await context.read<UserProvider>().ctrl!.download_song(txt_ctrl.value.text);
                    if (song == null) {
                      print("error");
                    }
                    else {
                      setState(() {
                        songs.add(song);
                      });
                    }
                    Navigator.pop(context);
                  })
            ],
        ));
  }

  // pass the songs and the index
  void _analyze_song(Song song) async {
    print(song.yt_url);
    final res = await context.read<UserProvider>().ctrl!.split_song(song.id);
    if (res == true) {
      print('analyzed');
      setState(() {
        song.analyzed = true;
      });
    } else {
      print('not analyzed');
    }
  }

  void _open_song_page(Song song) {
    context.go('/song', extra: song);
  }

  void _do_logout() {
    context.read<UserProvider>().logout();
    context.go('/login');
  }

  void _search_similar(Song song) async {
    final similar_song = await context.read<UserProvider>().ctrl!.get_suggestion(song.id);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Similar song"),
        content: ListView(
          children: similar_song.map((e) => ListTile(
            title: Text("${e.artist_name} - ${e.song_name}"),
          )).toList(),
        ),
        actions: [
          MaterialButton(
            child: const Text("Close"),
            onPressed: () {
              Navigator.pop(context);
          })
        ],
      ));
  }
}
