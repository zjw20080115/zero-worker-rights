package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String username;
    private String password;
    private String nickname;
}