package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class PostDTO {
    private Integer userId; // 发帖人ID（暂时先直接传，后面再优化成从Token获取）
    private String title;
    private String content;
    private String category;
    private Boolean anonymous;
}