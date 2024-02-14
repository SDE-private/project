import 'package:flutter/material.dart';
import 'package:frontend/ui/pages/auth.dart';
import 'package:frontend/ui/pages/library.dart';
import 'package:frontend/ui/pages/login.dart';
import 'package:go_router/go_router.dart';


void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  final _router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (ctx, state) => const MyHomePage(title: 'Flutter Demo Home Page'),
      ),
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
          return AuthPage(token: token);
        }
      )
    ]
  );

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
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: const LoginPage()
    );
  }
}
