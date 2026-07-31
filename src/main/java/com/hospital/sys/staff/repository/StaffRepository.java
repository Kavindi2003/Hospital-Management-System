package com.hospital.sys.staff.repository;


import com.hospital.sys.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

}

// NOTES
// JpaRepository<Staff, Long> --->
    // Staff → the entity this repository manages.
    // Long → type of the primary key (staffId).

// extends JpaRepository<Staff, Long> --->
    // Spring automatically gives us methods like;
        // save(staff);
        // findAll();
        // findById(id);
        // deleteById(id);
        // count();

// Eventhough this StaffRepository looks like emty,
// Spring automatically creates methods as mentioned above.
// We can add custom methods later if we need them.
    //EX: List<Staff> findByRole(String role);