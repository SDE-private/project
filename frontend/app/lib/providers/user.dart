import 'dart:html';

import 'package:flutter/material.dart';
import 'package:frontend/controllers/user.dart';

class UserProvider with ChangeNotifier {
  String? token;
  UserController? ctrl;

  bool is_logged() {
    return token == null ? false : true;
  }

  void login() {
    //check cookie existance
    try {
      if (document.cookie!.isEmpty) {
        return;
      }
    } catch (e) {
      return;
    }
    // get content of cookie called sde-token
    List<String> tokens = document.cookie!.split(';');
    token = tokens.firstWhere((element) => element.contains('sde-token'));
    token = token!.split('=')[1];
    print(token);
    ctrl = UserController(get_headers()!);
  }

  void logout() {
    token = null;
  }

  Map<String, String>? get_headers() {
    if (token == null) {
      return null;
    } else {
      return {"authorization": token!, "Content-Type": "application/json"};
    }
  }
}
