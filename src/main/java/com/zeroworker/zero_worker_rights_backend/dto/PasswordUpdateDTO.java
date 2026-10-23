package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class PasswordUpdateDTO {
    private Integer userId;
    private String oldPassword;
    private String newPassword;
}