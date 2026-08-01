package com.hospital.sys.ward;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoomAllocationService {

    private final RoomAllocationRepository roomAllocationRepository;

    public RoomAllocationService(RoomAllocationRepository roomAllocationRepository) {
        this.roomAllocationRepository = roomAllocationRepository;
    }

    public List<RoomAllocation> getAllAllocations() { return roomAllocationRepository.findAll(); }
    public Optional<RoomAllocation> getAllocationById(Long id) { return roomAllocationRepository.findById(id); }
    public RoomAllocation saveAllocation(RoomAllocation allocation) { return roomAllocationRepository.save(allocation); }
    public void deleteAllocation(Long id) { roomAllocationRepository.deleteById(id); }
}