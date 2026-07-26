package com.hospital.sys.staff.service;

import com.hospital.sys.staff.entity.Staff;
import com.hospital.sys.staff.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Tells Spring: "This class contains the business logic."
         // Spring automatically creates an object of this class
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) { // called, Dependency Injection
                                                             // Spring automatically gives us a StaffRepository object.
                                                             // No need to write: new StaffRepository();
                                                             // actually we can't instantiate a repository like that because it's an interface.
        this.staffRepository = staffRepository;
    }

    // Get all staff members
    public List<Staff> getAllStaff() {
        return staffRepository.findAll(); // findAll() --> staffRepository.findAll();
                                                // Returns every row from the staff table.
                                                // Equivalent SQL: SELECT * FROM staff;
    }

    // Save a new staff member
    public Staff saveStaff(Staff staff) {
        return staffRepository.save(staff); // save() --> staffRepository.save(staff);
                                                // If it's a new staff member,
                                                    // -->it performs an INSERT.
                                                // If the staff member already exists (same primary key),
                                                    // -->it performs an UPDATE.
                                            // That's one reason why JpaRepository is so powerful.
    }
}
