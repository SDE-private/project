import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AuthPage extends StatefulWidget {
  String? token;
  AuthPage({super.key, required this.token});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  @override
  Widget build(BuildContext context) {
    print(widget.token);
    if (widget.token == null) {
      return const Placeholder();
    }
    else {
      context.go('/library');
    }
    return Placeholder();
  }
}
