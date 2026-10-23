package com.zeroworker.zero_worker_rights_backend.repository;

import com.zeroworker.zero_worker_rights_backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUserIdOrderByCreateTimeDesc(Integer userId);
    List<Post> findByTitleContainingOrContentContainingOrderByCreateTimeDesc(String titleKeyword, String contentKeyword);
}