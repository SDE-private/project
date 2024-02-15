import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  String? token;

  bool is_logged() {
    return token == null ? false : true;
  }

  void login(String auth_token) {
    token = auth_token;
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
        "Authorization": "Bearer ${token!}"
      };
    }
  }
}