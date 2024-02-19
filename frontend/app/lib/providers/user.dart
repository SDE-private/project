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
        // "Authorization": "${token!}",
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJlYSBEaXBhY2UiLCJlbWFpbCI6ImFuZHJlYS5kaXBhY2VAc3R1ZGVudGkudW5pdG4uaXQiLCJpYXQiOjE3MDgyOTI2MjgsImV4cCI6MTcwODM3OTAyOH0.rKd8U099iYNgImgmJ_R8xRFRt78thmMfG2f3cwdrkSQ",
        "Content-Type": "application/json"
      };
    }
  }
}