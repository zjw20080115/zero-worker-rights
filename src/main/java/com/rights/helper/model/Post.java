package com.rights.helper.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="posts")
public class Post {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id") public User user;
 @Column(nullable=false,length=100) public String title;
 @Column(nullable=false,columnDefinition="TEXT") public String content;
 @Column(nullable=false,length=30) public String category;
 @Column(nullable=false) public boolean anonymous;
 @Column(nullable=false) public int likeCount=0;
 @Column(nullable=false) public int commentCount=0;
 @Column(nullable=false) public int reportCount=0;
 @Column(nullable=false) public LocalDateTime createTime;
 @PrePersist void init(){createTime=LocalDateTime.now();}
}
