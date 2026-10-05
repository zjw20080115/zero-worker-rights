package com.zeroworker.zero_worker_rights_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rights_records")
public class RightsRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;          // 用户ID
    private String problemType;      // 权益问题类型
    @Column(columnDefinition = "TEXT")
    private String description;      // 问题描述

    @Column(columnDefinition = "TEXT")
    private String selfTestResult;   // 权益自测结果

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;       // AI 初步分析

    @Column(columnDefinition = "TEXT")
    private String materials;        // 材料准备

    @Column(columnDefinition = "TEXT")
    private String checkResult;      // 申报前检查

    @Column(columnDefinition = "TEXT")
    private String nextStep;         // 下一步

    private LocalDateTime createTime;
}