package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.RightsRecordDTO;
import com.zeroworker.zero_worker_rights_backend.entity.RightsRecord;
import com.zeroworker.zero_worker_rights_backend.repository.RightsRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class RightsRecordService {

    @Autowired
    private RightsRecordRepository rightsRecordRepository;

    // 保存一条新的权益记录（B 那边点“保存到我的权益记录”时调用）
    public RightsRecord addRecord(RightsRecordDTO dto) {
        RightsRecord record = new RightsRecord();
        record.setUserId(dto.getUserId());
        record.setProblemType(dto.getProblemType());
        record.setDescription(dto.getDescription());
        record.setSelfTestResult(dto.getSelfTestResult());
        record.setAiAnalysis(dto.getAiAnalysis());
        record.setMaterials(dto.getMaterials());
        record.setCheckResult(dto.getCheckResult());
        record.setNextStep(dto.getNextStep());
        record.setCreateTime(LocalDateTime.now(java.time.ZoneId.of("Asia/Shanghai")));
        return rightsRecordRepository.save(record);
    }

    // 获取某个用户的全部权益记录
    public List<RightsRecord> getRecordsByUserId(Integer userId) {
        return rightsRecordRepository.findByUserId(userId);
    }

    // 根据 ID 获取单条记录
    public RightsRecord getRecordById(Integer id) {
        return rightsRecordRepository.findById(id).orElse(null);
    }

    // 删除某条记录
    public String deleteRecord(Integer id) {
        if (rightsRecordRepository.existsById(id)) {
            rightsRecordRepository.deleteById(id);
            return "删除成功！";
        }
        return "记录不存在！";
    }
}