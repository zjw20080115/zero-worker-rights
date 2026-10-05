package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.LikeDTO;
import com.zeroworker.zero_worker_rights_backend.entity.PostLike;
import com.zeroworker.zero_worker_rights_backend.repository.PostLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class LikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    public String likePost(LikeDTO dto) {
        // 检查是否已经点过赞
        if (postLikeRepository.findByPostIdAndUserId(dto.getPostId(), dto.getUserId()) != null) {
            return "您已经点过赞了！";
        }
        PostLike like = new PostLike();
        like.setPostId(dto.getPostId());
        like.setUserId(dto.getUserId());
        like.setCreateTime(LocalDateTime.now());
        postLikeRepository.save(like);
        return "点赞成功！";
    }

    // 取消点赞
    public String unlikePost(LikeDTO dto) {
        // 检查是否点过赞
        if (postLikeRepository.findByPostIdAndUserId(dto.getPostId(), dto.getUserId()) == null) {
            return "您还没有点过赞！";
        }
        // 删除点赞记录
        postLikeRepository.deleteByPostIdAndUserId(dto.getPostId(), dto.getUserId());
        return "取消点赞成功！";
    }
}