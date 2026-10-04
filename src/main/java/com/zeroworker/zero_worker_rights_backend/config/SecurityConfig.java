package com.zeroworker.zero_worker_rights_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. 关闭 CSRF 保护（前后端分离开发时通常关掉，否则 Postman 会报错）
                .csrf(csrf -> csrf.disable())
                // 2. 关闭默认的登录弹窗（用浏览器访问时不会弹出一个登录框）
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                // 3. 配置接口访问权限
                .authorizeHttpRequests(auth -> auth
                        // 允许所有 /api/auth/** 开头的接口（注册、登录）被所有人访问
                        .requestMatchers("/api/auth/**").permitAll()
                        // 允许 /api/test 测试接口被所有人访问
                        .requestMatchers("/api/test").permitAll()
                        // 其他所有接口都需要登录认证才能访问
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}