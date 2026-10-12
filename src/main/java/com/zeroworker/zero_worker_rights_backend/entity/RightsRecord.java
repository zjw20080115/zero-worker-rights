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

    private Integer userId;
    private String problemType;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String rawAnswers;     // 新增：原始问卷作答（JSON）

    @Column(columnDefinition = "TEXT")
    private String fullResult;     // 新增：完整的自测结果（JSON）

    @Column(columnDefinition = "TEXT")
    private String selfTestResult;

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;

    @Column(columnDefinition = "TEXT")
    private String materials;

    @Column(columnDefinition = "TEXT")
    private String checkResult;

    @Column(columnDefinition = "TEXT")
    private String nextStep;

    private LocalDateTime createTime;
}