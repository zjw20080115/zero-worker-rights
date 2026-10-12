package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.LoginResultDTO;
import com.zeroworker.zero_worker_rights_backend.dto.Result;
import com.zeroworker.zero_worker_rights_backend.dto.UserLoginDTO;
import com.zeroworker.zero_worker_rights_backend.dto.UserRegisterDTO;
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
        // 1. 先看用户是否存在
        User user = userRepository.findByUsername(dto.getUsername());
        if (user == null) {
            // 明确返回 400 错误，前端收到 code=400 就说明登录失败
            return new Result<>(400, "用户不存在！", null);
        }
        // 2. 再校验密码（使用 matches 比对加密后的密码）
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return new Result<>(400, "密码错误！", null);
        }

        // 3. 只有上面两步都通过，才生成 Token 并返回数据
        String token = java.util.UUID.randomUUID().toString();

        LoginResultDTO data = new LoginResultDTO();
        data.setUserId(user.getId());
        data.setUsername(user.getUsername());
        data.setNickname(user.getNickname());
        data.setToken(token);

        return new Result<>(200, "登录成功！", data);
    }
}
