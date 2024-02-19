import 'package:flutter/material.dart';
import 'package:frontend/classes/song.dart';
import 'package:frontend/providers/user.dart';
import 'package:frontend/ui/pages/auth.dart';
import 'package:frontend/ui/pages/fail.dart';
import 'package:frontend/ui/pages/library.dart';
import 'package:frontend/ui/pages/login.dart';
import 'package:frontend/ui/pages/song.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(ChangeNotifierProvider(
    create: (context) => UserProvider(),
    child: MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  final _router = GoRouter(routes: [
    GoRoute(
        path: '/',
        builder: (ctx, state) {
          bool logged = ctx.read<UserProvider>().is_logged();
          return logged ? const LibraryPage() : const LoginPage();
        }),
    GoRoute(
      path: '/login',
      builder: (ctx, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/library',
      builder: (ctx, state) => const LibraryPage(),
    ),
    GoRoute(
        path: '/auth',
        builder: (ctx, state) {
          String? token = state.uri.queryParameters['token'];
          print(token);
          return AuthPage(token: token);
        }),
    GoRoute(
        path: '/song',
        builder: (ctx, state) {
          Song song = state.extra as Song;
          return SongPage(song: song);
        }),
    GoRoute(
        path: '/fail',
        builder: (ctx, state) {
          return const FailPage();
        })
  ]);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
        title: 'Flutter Demo',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          useMaterial3: true,
        ),
        routerConfig: _router,
        debugShowCheckedModeBanner: false);
  }
}
