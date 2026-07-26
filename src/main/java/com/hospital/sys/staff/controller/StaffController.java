package com.hospital.sys.staff.controller;

import com.hospital.sys.staff.entity.Staff;
import com.hospital.sys.staff.service.StaffService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Means: "This class handles web requests."
@RequestMapping("/staff") // Every method inside this class starts with --> /staff

public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // Get all staff
    @GetMapping  // GET /staff___Returns every staff member.
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    // Add new staff
    @PostMapping  // POST /staff___Adds a new staff member.
    public Staff addStaff(@RequestBody Staff staff) { // @RequestBody --->
                                                          // "Take the data sent by the user and,
                                                          // convert it into a Staff object."
        return staffService.saveStaff(staff);
    }

}
