package com.hospital.sys.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    // GET /api/auth/me -> { "username": "...", "role": "DOCTOR" }
    // Called by dashboard.html on page load to decide which module
    // cards to show. Spring Security has already verified the session
    // by the time this runs (it's behind .anyRequest().authenticated()).
    @GetMapping("/api/auth/me")
    public Map<String, String> me(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");

        return Map.of(
                "username", authentication.getName(),
                "role", role
        );
    }
}