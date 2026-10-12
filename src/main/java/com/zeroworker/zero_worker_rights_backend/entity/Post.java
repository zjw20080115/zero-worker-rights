package com.zeroworker.zero_worker_rights_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import jakarta.persistence.Transient;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId; // 发帖用户ID

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String category;

    private Boolean anonymous; // 是否匿名

    private Integer likeCount;

    private Integer status;

    private LocalDateTime createTime;

    @Transient  // 加上这个注解，告诉 JPA 这个字段不是数据库里的列
    private String author;
}