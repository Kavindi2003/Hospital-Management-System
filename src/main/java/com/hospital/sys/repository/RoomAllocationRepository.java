package com.hospital.sys.repository;

import com.hospital.sys.entity.RoomAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomAllocationRepository extends JpaRepository<RoomAllocation, Long> {

}