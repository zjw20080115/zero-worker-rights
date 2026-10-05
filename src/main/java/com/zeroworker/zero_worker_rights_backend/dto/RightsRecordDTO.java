package com.zeroworker.zero_worker_rights_backend.dto;

import lombok.Data;

@Data
public class RightsRecordDTO {
    private Integer userId;
    private String problemType;
    private String description;
    private String selfTestResult;
    private String aiAnalysis;
    private String materials;
    private String checkResult;
    private String nextStep;
}