package com.rights.helper.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="comments")
public class Comment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="post_id") public Post post;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id") public User user;
 @Column(nullable=false,columnDefinition="TEXT") public String content;
 @Column(nullable=false) public LocalDateTime createTime;
 @PrePersist void init(){createTime=LocalDateTime.now();}
}
