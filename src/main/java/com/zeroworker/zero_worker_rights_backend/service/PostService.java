package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.PostDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Post;
import com.zeroworker.zero_worker_rights_backend.entity.User;
import com.zeroworker.zero_worker_rights_backend.repository.CommentRepository;
import com.zeroworker.zero_worker_rights_backend.repository.PostLikeRepository; // ★ 新增导入
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostLikeRepository postLikeRepository; // ★ 注入点赞表

    // 1. 获取所有帖子（已加上实时点赞和评论统计）
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            fillPostExtraInfo(post);
        }
        return posts;
    }

    // 2. 根据ID获取单个帖子
    public Post getPostById(Integer id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {
            fillPostExtraInfo(post); // 单个详情页也加上统计
        }
        return post;
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

    // 5. 根据用户ID获取帖子（个人主页用）
    public List<Post> getPostsByUserId(Integer userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreateTimeDesc(userId);
        for (Post post : posts) {
            fillPostExtraInfo(post);
        }
        return posts;
    }

    // 6. 搜索帖子
    public List<Post> searchPosts(String keyword) {
        List<Post> posts;
        if (keyword == null || keyword.trim().isEmpty()) {
            posts = postRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createTime"));
        } else {
            posts = postRepository.findByTitleContainingOrContentContainingOrderByCreateTimeDesc(keyword, keyword);
        }

        for (Post post : posts) {
            fillPostExtraInfo(post);
        }
        return posts;
    }

    // ★ ==========================================
    // ★ 核心复用方法：统一处理作者昵称、真实点赞数、真实评论数
    // ★ ==========================================
    private void fillPostExtraInfo(Post post) {
        // 1. 补全作者名字
        if (post.getAnonymous() != null && post.getAnonymous()) {
            post.setAuthor("匿名用户");
        } else {
            User user = userRepository.findById(post.getUserId()).orElse(null);
            if (user != null) {
                post.setAuthor(user.getNickname() != null ? user.getNickname() : user.getUsername());
            } else {
                post.setAuthor("未知用户");
            }
        }

        // 2. 实时统计真实点赞数并覆盖
        long realLikeCount = postLikeRepository.countByPostId(post.getId());
        post.setLikeCount((int) realLikeCount);

        // 3. 实时统计真实评论数
        long realCommentCount = commentRepository.countByPostId(post.getId());
        post.setCommentCount(realCommentCount);
    }
}