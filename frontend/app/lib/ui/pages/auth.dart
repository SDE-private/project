import 'package:flutter/material.dart';
import 'package:frontend/providers/user.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class AuthPage extends StatefulWidget {
  String? token;
  AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  @override
  Widget build(BuildContext context) {
    context.read<UserProvider>().login();
    context.go('/library');
    return const Scaffold();
  }
}
