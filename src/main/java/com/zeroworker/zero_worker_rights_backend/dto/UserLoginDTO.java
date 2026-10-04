package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class UserLoginDTO {
    private String username;
    private String password;
}