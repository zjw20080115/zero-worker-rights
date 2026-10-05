package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.CommentDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Comment;
import com.zeroworker.zero_worker_rights_backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment addComment(CommentDTO dto) {
        Comment comment = new Comment();
        comment.setPostId(dto.getPostId());
        comment.setUserId(dto.getUserId());
        comment.setContent(dto.getContent());
        comment.setStatus(1);
        comment.setCreateTime(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}