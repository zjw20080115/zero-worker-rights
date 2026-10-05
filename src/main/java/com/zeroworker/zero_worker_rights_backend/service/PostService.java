package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.PostDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Post;
import com.zeroworker.zero_worker_rights_backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // 1. 获取所有帖子
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 2. 根据ID获取单个帖子
    public Post getPostById(Integer id) {
        return postRepository.findById(id).orElse(null);
    }

    // 3. 发布新帖子
    public Post createPost(PostDTO dto) {
        Post post = new Post();
        post.setUserId(dto.getUserId());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCategory(dto.getCategory());
        post.setAnonymous(dto.getAnonymous() != null ? dto.getAnonymous() : false);
        post.setLikeCount(0);
        post.setStatus(1); // 1表示正常
        post.setCreateTime(LocalDateTime.now());
        return postRepository.save(post);
    }

    // 4. 删除帖子
    public boolean deletePost(Integer id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }
}