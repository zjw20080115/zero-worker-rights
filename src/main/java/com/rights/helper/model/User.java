package com.rights.helper.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,unique=true,length=50) public String username;
 @Column(nullable=false,length=100) public String password;
 @Column(nullable=false,length=50) public String nickname;
 @Column(nullable=false) public LocalDateTime createTime;
 @PrePersist void init(){createTime=LocalDateTime.now();}
}
