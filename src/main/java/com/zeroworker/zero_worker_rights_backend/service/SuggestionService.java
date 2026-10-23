package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.SuggestionDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Suggestion;
import com.zeroworker.zero_worker_rights_backend.repository.SuggestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class SuggestionService {

    @Autowired
    private SuggestionRepository suggestionRepository;

    public void addSuggestion(SuggestionDTO dto) {
        Suggestion suggestion = new Suggestion();
        suggestion.setUserId(dto.getUserId());
        suggestion.setContent(dto.getContent());
        suggestion.setCreateTime(LocalDateTime.now(ZoneId.of("Asia/Shanghai")));
        suggestionRepository.save(suggestion);
    }
}