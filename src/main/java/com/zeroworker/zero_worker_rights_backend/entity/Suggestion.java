package com.zeroworker.zero_worker_rights_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "suggestions")
public class Suggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    private LocalDateTime createTime;
}