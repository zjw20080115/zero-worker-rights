package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.PostDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Post;
import com.zeroworker.zero_worker_rights_backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // 获取所有帖子
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // 获取单个帖子
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    // 发布帖子
    @PostMapping
    public Post createPost(@RequestBody PostDTO dto) {
        return postService.createPost(dto);
    }

    // 删除帖子
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Integer id) {
        boolean success = postService.deletePost(id);
        return success ? "删除成功！" : "帖子不存在！";
    }
}
