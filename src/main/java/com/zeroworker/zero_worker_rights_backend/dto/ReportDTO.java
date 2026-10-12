package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class ReportDTO {
    private Integer postId;
    private Integer userId;
    private String reason;
}