package com.hospital.sys.auth.config;

import com.hospital.sys.auth.entity.User;
import com.hospital.sys.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// Creates one demo account per role on first startup, only if the users
// table is empty -- so this is safe to leave in for the viva demo and
// won't duplicate accounts on every restart.
//
// Demo logins (change these before anything ever goes near production):
//   admin        / admin123
//   dr.smith     / doctor123   (linked to staffId=2, "Sarah Smith" in the
//                                staff table -- CHECK this matches your
//                                actual seeded staff_id before demoing;
//                                auto-increment drift has changed these
//                                IDs before, see the sql.init.mode fix)
//   nurse.joy    / nurse123
//   frontdesk    / reception123
@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return; // already seeded
            }

            userRepository.save(new User("admin", encoder.encode("admin123"), "ADMIN"));
            // staffId=2L assumes Sarah Smith is staff_id 2 in your current DB.
            // Check `SELECT * FROM staff;` and update this if it doesn't match.
            userRepository.save(new User("dr.smith", encoder.encode("doctor123"), "DOCTOR", 2L));
            userRepository.save(new User("nurse.joy", encoder.encode("nurse123"), "NURSE"));
            userRepository.save(new User("frontdesk", encoder.encode("reception123"), "RECEPTIONIST"));
        };
    }
}