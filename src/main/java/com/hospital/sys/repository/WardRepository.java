package com.hospital.sys.repository;

import com.hospital.sys.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, Long> {
}