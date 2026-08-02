package com.hospital.sys.staff.controller;

import com.hospital.sys.staff.entity.Staff;
import com.hospital.sys.staff.service.StaffService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:63342") // Allows requests coming from http://localhost:63342
                                                 // to access this controller.
                                                 // bcz,
                                                        // Frontend: http://localhost:63342 (your staff.html page)
                                                        // Backend: http://localhost:8080 (Spring Boot)
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

    // Get one staff member by ID
    @GetMapping("/{id}")
    public Staff getStaffById(@PathVariable Long id) { // This method returns one staff member,
                                                       // using the ID provided in the URL.
        return staffService.getStaffById(id);
    }

    // Update a staff member
    @PutMapping
    public Staff updateStaff(@RequestBody Staff staff) { // This method updates an existing staff member.
                                                         // The updated details are received from the request body.
        return staffService.updateStaff(staff);
    }

    // Delete a staff member
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable Long id) { // This method deletes a staff member using the ID.
        staffService.deleteStaff(id);                // @PathVariable: It takes the value from the URL and,
                                                                    // stores it in the variable id.
    }

}
