package com.hospital.sys.service;

import com.hospital.sys.entity.RoomAllocation;
import com.hospital.sys.repository.RoomAllocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomAllocationService {

    @Autowired
    private RoomAllocationRepository roomAllocationRepository;

    public List<RoomAllocation> getAllAllocations() {
        return roomAllocationRepository.findAll();
    }

    public Optional<RoomAllocation> getAllocationById(Long id) {
        return roomAllocationRepository.findById(id);
    }

    public RoomAllocation saveAllocation(RoomAllocation allocation) {
        return roomAllocationRepository.save(allocation);
    }

    public void deleteAllocation(Long id) {
        roomAllocationRepository.deleteById(id);
    }
}