package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.ReportDTO;
import com.zeroworker.zero_worker_rights_backend.entity.Report;
import com.zeroworker.zero_worker_rights_backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Report addReport(ReportDTO dto) {
        Report report = new Report();
        report.setPostId(dto.getPostId());
        report.setUserId(dto.getUserId());
        report.setReason(dto.getReason());
        report.setStatus(1);
        report.setCreateTime(LocalDateTime.now());
        return reportRepository.save(report);
    }
}