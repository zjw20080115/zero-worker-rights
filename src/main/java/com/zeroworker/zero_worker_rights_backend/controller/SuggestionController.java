package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.Result;
import com.zeroworker.zero_worker_rights_backend.dto.SuggestionDTO;
import com.zeroworker.zero_worker_rights_backend.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    @PostMapping
    public Result<Void> addSuggestion(@RequestBody SuggestionDTO dto) {
        suggestionService.addSuggestion(dto);
        return new Result<>(200, "提交成功", null);
    }
}