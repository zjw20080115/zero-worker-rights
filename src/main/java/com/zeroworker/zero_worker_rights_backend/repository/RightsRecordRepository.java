package com.zeroworker.zero_worker_rights_backend.repository;

import com.zeroworker.zero_worker_rights_backend.entity.RightsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RightsRecordRepository extends JpaRepository<RightsRecord, Integer> {
    // 根据用户ID查询他的权益记录
    List<RightsRecord> findByUserId(Integer userId);
}