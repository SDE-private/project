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
      const Text(
        "Welcome to the app!",
        style: TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.bold,
            color: Colors.black,
            decoration: TextDecoration.none),
        textAlign: TextAlign.center,
      ),
      const SizedBox(height: 20),
      const Text(
        "Please login to continue",
        style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.normal,
            color: Colors.black,
            decoration: TextDecoration.none),
        textAlign: TextAlign.center,
      ),
      const SizedBox(height: 20),
      SignInButton(
        Buttons.google,
        onPressed: _do_login,
      ),
    ]));
  }

  void _do_login() {
    html.window.location.replace("http://localhost:3001/auth/login");
  }
}
