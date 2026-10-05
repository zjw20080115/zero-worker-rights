package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.ReportDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Report;
import com.zeroworker.zero_worker_rights_backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public Report addReport(@RequestBody ReportDTO dto) {
        return reportService.addReport(dto);
    }
}