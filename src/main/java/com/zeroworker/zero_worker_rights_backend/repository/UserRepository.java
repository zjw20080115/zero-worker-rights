package com.zeroworker.zero_worker_rights_backend.repository;

import com.zeroworker.zero_worker_rights_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
