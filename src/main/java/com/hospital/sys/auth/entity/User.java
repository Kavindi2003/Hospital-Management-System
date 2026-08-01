package com.hospital.sys.auth.entity;

import jakarta.persistence.*;

// A dedicated login/account record — deliberately separate from Staff.
// Staff holds business data (name, specialization, phone...); User holds
// only what's needed to authenticate and decide which dashboard to show.
//
// staffId links a login account to a row in the `staff` table, so the
// system can answer "which doctor is this logged-in user" -- needed for
// scoping a doctor's view to only their own patients' records. Only
// meaningful for DOCTOR accounts right now; left null for ADMIN/NURSE/
// RECEPTIONIST accounts that don't need this link yet.
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    // Stored as a BCrypt hash, never plain text (see SecurityConfig's
    // PasswordEncoder bean, and CustomUserDetailsService which loads this).
    @Column(nullable = false)
    private String password;

    // One of: ADMIN, DOCTOR, NURSE, RECEPTIONIST
    @Column(nullable = false, length = 20)
    private String role;

    // Links this login account to a row in the `staff` table.
    // Nullable -- only DOCTOR accounts need this today.
    @Column(name = "staff_id")
    private Long staffId;

    public User() {}

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public User(String username, String password, String role, Long staffId) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.staffId = staffId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
}