import 'dart:html' as html;

import 'package:flutter/material.dart';

class FailPage extends StatefulWidget {
  const FailPage({super.key});

  @override
  State<FailPage> createState() => _FailPageState();
}

class _FailPageState extends State<FailPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: const Text("Fail"),
        ),
        // add text and button navigator
        body: Center(
            child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Login failed"),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () =>
                  html.window.location.replace("http://localhost/app/"),
              child: const Text("Retry"),
            ),
          ],
        )));
  }
}
