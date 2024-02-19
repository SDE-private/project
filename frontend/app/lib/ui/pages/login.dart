import 'dart:html' as html;

import 'package:flutter/material.dart';
import 'package:sign_in_button/sign_in_button.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      SignInButton(
        Buttons.google,
        onPressed: _do_login,
      ),
    ]));
  }

  void _do_login() {
    // context.go(Uri(path: "/auth", queryParameters: {"token": "ciao"}).toString());
    html.window.location.replace("http://localhost:3001/auth/login");
  }
}
