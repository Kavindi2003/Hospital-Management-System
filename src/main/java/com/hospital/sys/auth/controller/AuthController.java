package com.hospital.sys.auth.controller;

import com.hospital.sys.auth.entity.User;
import com.hospital.sys.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final List<String> VALID_ROLES = List.of("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /api/auth/me -> { "username": "...", "role": "DOCTOR" }
    // Called by dashboard.html on page load to decide which module
    // cards to show. Spring Security has already verified the session
    // by the time this runs (it's behind .authenticated()).
    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");

        Long staffId = userRepository.findByUsername(authentication.getName())
                .map(User::getStaffId)
                .orElse(null);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("username", authentication.getName());
        result.put("role", role);
        result.put("staffId", staffId); // null for non-doctor accounts
        return result;
    }

    // POST /api/auth/register -> creates a new login account.
    // Restricted to ADMIN only at the SecurityConfig level (see the
    // explicit hasRole("ADMIN") rule for this exact path) -- this method
    // doesn't need to re-check the role itself, Spring Security already
    // rejects anyone else with a 403 before this code ever runs.
    //
    // Exists mainly so a new user (e.g. for a viva demo) can be added
    // through the running app instead of hand-writing SQL with a
    // pre-computed BCrypt hash.
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()
                || request.password() == null || request.password().isBlank()
                || request.role() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "username, password, and role are all required."));
        }

        String role = request.role().toUpperCase();
        if (!VALID_ROLES.contains(role)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "role must be one of: " + VALID_ROLES));
        }

        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "That username is already taken."));
        }

        // DOCTOR accounts must be linked to a staff record, or the EHR module
        // has no way to know which doctor's records this login should see.
        if (role.equals("DOCTOR") && request.staffId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "A Doctor account needs a Staff ID so their records can be filtered correctly."));
        }

        User newUser = new User(
                request.username(),
                passwordEncoder.encode(request.password()), // never store the plain password
                role,
                request.staffId()
        );
        userRepository.save(newUser);

        // Deliberately not returning the password (not even the hash) in the response.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "username", newUser.getUsername(),
                        "role", newUser.getRole()
                ));
    }

    // GET /api/auth/users -> list every account (no password/hash included).
    // Restricted to ADMIN at the SecurityConfig level.
    @GetMapping("/users")
    public List<Map<String, Object>> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> m = new java.util.HashMap<>();
                    m.put("userId", u.getUserId());
                    m.put("username", u.getUsername());
                    m.put("role", u.getRole());
                    m.put("staffId", u.getStaffId());
                    return m;
                })
                .toList();
    }

    // DELETE /api/auth/users/{id} -> removes a login account.
    // Restricted to ADMIN at the SecurityConfig level. Also blocks an admin
    // from deleting their OWN account through this panel, so a demo/viva
    // session can't accidentally lock the admin out mid-way through.
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        User target = userRepository.findById(id).orElse(null);
        if (target == null) {
            return ResponseEntity.notFound().build();
        }

        if (target.getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "You can't delete your own account while logged in as it."));
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record RegisterRequest(String username, String password, String role, Long staffId) {}
}