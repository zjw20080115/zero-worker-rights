package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.UserLoginDTO;
import com.zeroworker.zero_worker_rights_backend.dto.UserRegisterDTO;
import com.zeroworker.zero_worker_rights_backend.entity.User;
import com.zeroworker.zero_worker_rights_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(UserRegisterDTO dto) {
        // 1. 检查用户名是否已存在
        if (userRepository.findByUsername(dto.getUsername()) != null) {
            return "用户名已存在！";
        }
        // 2. 创建新用户并加密密码
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // 密码加密，千万别存明文！
        user.setNickname(dto.getNickname());

        userRepository.save(user);
        return "注册成功！";
    }

    public String login(UserLoginDTO dto) {
        // 1. 根据用户名查询用户
        User user = userRepository.findByUsername(dto.getUsername());
        if (user == null) {
            return "用户不存在！";
        }
        // 2. 校验密码（注意：这里是用匹配器 compare 明文和加密后的密码，不是直接比较字符串！）
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return "密码错误！";
        }
        return "登录成功！";
    }
}
