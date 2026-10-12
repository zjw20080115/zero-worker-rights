package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class LoginResultDTO {
    private Integer userId;   // 注意这里叫 userId
    private String username;
    private String nickname;
    private String token;
}