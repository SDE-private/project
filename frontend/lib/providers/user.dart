import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  String? token;

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