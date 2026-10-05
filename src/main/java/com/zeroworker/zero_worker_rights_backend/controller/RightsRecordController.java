package com.zeroworker.zero_worker_rights_backend.controller;

import com.zeroworker.zero_worker_rights_backend.dto.RightsRecordDTO;
import com.zeroworker.zero_worker_rights_backend.entity.RightsRecord;
import com.zeroworker.zero_worker_rights_backend.service.RightsRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rights-records")
public class RightsRecordController {

    @Autowired
    private RightsRecordService rightsRecordService;

    // 新增
    @PostMapping
    public RightsRecord addRecord(@RequestBody RightsRecordDTO dto) {
        return rightsRecordService.addRecord(dto);
    }

    // 查询某人的记录
    @GetMapping("/user/{userId}")
    public List<RightsRecord> getRecords(@PathVariable Integer userId) {
        return rightsRecordService.getRecordsByUserId(userId);
    }

    // 查询单条
    @GetMapping("/{id}")
    public RightsRecord getRecordById(@PathVariable Integer id) {
        return rightsRecordService.getRecordById(id);
    }

    // 删除
    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable Integer id) {
        return rightsRecordService.deleteRecord(id);
    }
}