package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.PostDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Post;
import com.zeroworker.zero_worker_rights_backend.entity.User;
import com.zeroworker.zero_worker_rights_backend.repository.PostRepository;
import com.zeroworker.zero_worker_rights_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // 1. 获取所有帖子
    @Autowired
    private UserRepository userRepository; // 加在类的最上方，注入 UserRepository

    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        // 遍历每个帖子，给它补上 author 字段
        for (Post post : posts) {
            if (post.getAnonymous() != null && post.getAnonymous()) {
                post.setAuthor("匿名用户");
            } else {
                // 如果不是匿名，去 user 表查昵称
                User user = userRepository.findById(post.getUserId()).orElse(null);
                if (user != null) {
                    post.setAuthor(user.getNickname() != null ? user.getNickname() : user.getUsername());
                } else {
                    post.setAuthor("未知用户");
                }
            }
        }
        return posts;
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