package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.*;
import com.zeroworker.zero_worker_rights_backend.entity.User;
import com.zeroworker.zero_worker_rights_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Result<String> register(UserRegisterDTO dto) {
        // 1. 检查用户名是否已存在
        if (userRepository.findByUsername(dto.getUsername()) != null) {
            return new Result<>(400, "用户名已存在！", null);
        }
        // 2. 创建新用户并加密密码
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        userRepository.save(user);
        return new Result<>(200, "注册成功！", "注册成功！");
    }

    public Result<LoginResultDTO> login(UserLoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername());

        // 1. 用户不存在
        if (user == null) {
            return new Result<>(400, "用户不存在！", null);
        }

        // 2. 密码错误
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return new Result<>(400, "密码错误！", null);
        }

        // 3. 登录成功，组装数据
        String token = java.util.UUID.randomUUID().toString();

        LoginResultDTO data = new LoginResultDTO();
        data.setUserId(user.getId());
        data.setUsername(user.getUsername());
        data.setNickname(user.getNickname());
        data.setToken(token);

        // ★ 核心：把用户的头像路径也塞进去
        data.setAvatar(user.getAvatar());

        return new Result<>(200, "登录成功！", data);
    }

    // 1. 修改昵称
    public String updateNickname(UserUpdateDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (user == null) {
            return "用户不存在！";
        }
        user.setNickname(dto.getNickname());
        userRepository.save(user);
        return "修改成功！";
    }

    // 2. 修改密码
    public String updatePassword(PasswordUpdateDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (user == null) {
            return "用户不存在！";
        }
        // 校验旧密码是否正确
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            return "旧密码错误！";
        }
        // 存入新密码（记得加密）
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return "密码修改成功！";
    }

    public String updateAvatar(Integer userId, String avatarPath) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return "用户不存在！";
        user.setAvatar(avatarPath);
        userRepository.save(user);
        return "头像修改成功！";
    }
}
