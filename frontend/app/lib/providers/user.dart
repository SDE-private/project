import 'package:flutter/material.dart';
import 'package:frontend/controllers/user.dart';

class UserProvider with ChangeNotifier {
  String? token;
  UserController? ctrl;

  bool is_logged() {
    return token == null ? false : true;
  }

  void login(String auth_token) {
    token = auth_token;
    ctrl = UserController(get_headers()!);
  }

  void logout() {
    token = null;
  }

  Map<String, String>? get_headers() {
    if (token == null) {
      return null;
    }
    else {
      return {
        "authorization": token!,
        "Content-Type": "application/json"
      };
    }
  }
}