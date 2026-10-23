package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class SuggestionDTO {
    private Integer userId;
    private String content;
}