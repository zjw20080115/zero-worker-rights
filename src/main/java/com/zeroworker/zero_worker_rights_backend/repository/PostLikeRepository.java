package com.zeroworker.zero_worker_rights_backend.repository;

import com.zeroworker.zero_worker_rights_backend.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface PostLikeRepository extends JpaRepository<PostLike, Integer> {
    // 检查该用户是否已点赞
    PostLike findByPostIdAndUserId(Integer postId, Integer userId);

    // 根据 postId 和 userId 删除点赞记录
    @Transactional
    void deleteByPostIdAndUserId(Integer postId, Integer userId);
}