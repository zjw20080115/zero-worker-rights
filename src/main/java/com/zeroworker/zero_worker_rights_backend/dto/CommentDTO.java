package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Integer postId;
    private Integer userId;
    private String content;
}