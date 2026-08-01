package com.hospital.sys.ward;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class RoomAllocationController {

    private final RoomAllocationService roomAllocationService;

    public RoomAllocationController(RoomAllocationService roomAllocationService) {
        this.roomAllocationService = roomAllocationService;
    }

    @GetMapping
    public List<RoomAllocation> getAllAllocations() { return roomAllocationService.getAllAllocations(); }

    @GetMapping("/{id}")
    public Optional<RoomAllocation> getAllocationById(@PathVariable Long id) { return roomAllocationService.getAllocationById(id); }

    @PostMapping
    public RoomAllocation createAllocation(@RequestBody RoomAllocation allocation) { return roomAllocationService.saveAllocation(allocation); }

    @PutMapping("/{id}")
    public RoomAllocation updateAllocation(@PathVariable Long id, @RequestBody RoomAllocation allocation) {
        allocation.setAllocationId(id);
        return roomAllocationService.saveAllocation(allocation);
    }

    @DeleteMapping("/{id}")
    public void deleteAllocation(@PathVariable Long id) { roomAllocationService.deleteAllocation(id); }
}