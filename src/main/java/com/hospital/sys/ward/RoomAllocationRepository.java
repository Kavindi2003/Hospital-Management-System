package com.hospital.sys.ward;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomAllocationRepository extends JpaRepository<RoomAllocation, Long> {
}