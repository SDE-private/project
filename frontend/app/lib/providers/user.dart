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
    // get content of cookie called sde-token
    List<String> tokens = document.cookie!.split(';');
    // check if sde-token exists
    tokens.forEach((element) {
      if (element.contains('sde-token')) {
        token = element;
      }
    });
    if (token == null) {
      window.location.replace("http://localhost:3001/auth/login");
    }
    token = token!.split('=')[1];
    print(token);
    ctrl = UserController(get_headers()!);
  }

  void logout() {
    document.cookie =
        'sde-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
