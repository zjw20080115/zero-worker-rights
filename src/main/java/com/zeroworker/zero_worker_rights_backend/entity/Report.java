package com.zeroworker.zero_worker_rights_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer postId;
    private Integer userId;
    private String reason;
    private Integer status;
    private LocalDateTime createTime;
}