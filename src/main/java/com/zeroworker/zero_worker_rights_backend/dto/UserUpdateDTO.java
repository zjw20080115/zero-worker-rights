package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private Integer userId;
    private String nickname;
}