package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.AiRequestDTO;
import com.zeroworker.zero_worker_rights_backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/analyze")
    public Map analyze(@RequestBody AiRequestDTO dto) {
        return aiService.analyze(dto);
    }
}