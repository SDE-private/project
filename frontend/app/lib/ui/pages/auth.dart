import 'package:flutter/material.dart';
import 'package:frontend/providers/user.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class AuthPage extends StatefulWidget {
  String? token;
  AuthPage({super.key, required this.token});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  @override
  Widget build(BuildContext context) {
    if (widget.token == null) {
      return const Placeholder();
    } else {
      context.read<UserProvider>().login(widget.token!);
      context.go('/library');
    }
    return Placeholder();
  }
}
