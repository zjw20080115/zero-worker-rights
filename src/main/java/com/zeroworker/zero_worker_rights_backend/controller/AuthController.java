package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.*;
import com.zeroworker.zero_worker_rights_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result<String> register(@RequestBody UserRegisterDTO dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public Result<LoginResultDTO> login(@RequestBody UserLoginDTO dto) {
        return userService.login(dto);
    }

    @PutMapping("/user/update")
    public String updateNickname(@RequestBody UserUpdateDTO dto) {
        return userService.updateNickname(dto);
    }

    @PutMapping("/user/password")
    public String updatePassword(@RequestBody PasswordUpdateDTO dto) {
        return userService.updatePassword(dto);
    }

    @PostMapping("/user/avatar")
    public String updateAvatar(@RequestBody java.util.Map<String, String> body) {
        Integer userId = Integer.parseInt(body.get("userId"));
        String avatarPath = body.get("avatar");
        return userService.updateAvatar(userId, avatarPath);
    }

}