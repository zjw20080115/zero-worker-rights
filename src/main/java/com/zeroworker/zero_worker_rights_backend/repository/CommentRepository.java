package com.zeroworker.zero_worker_rights_backend.repository;

import com.zeroworker.zero_worker_rights_backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostId(Integer postId);

    // 删除某条评论
    @Transactional
    void deleteById(Integer id);
}