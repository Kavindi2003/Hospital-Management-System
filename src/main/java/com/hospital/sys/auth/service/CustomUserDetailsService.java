package com.hospital.sys.auth.service;

import com.hospital.sys.auth.entity.User;
import com.hospital.sys.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

// Spring Security calls loadUserByUsername() during login to fetch the
// account and check the password. This is the one required bridge between
// our own User entity/table and Spring Security's authentication machinery.
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found: " + username));

        // Spring Security expects authorities prefixed with "ROLE_" when
        // using hasRole("ADMIN") etc. in the security config below.
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // already BCrypt-hashed in the DB
                .authorities(List.of(new org.springframework.security.core.authority
                        .SimpleGrantedAuthority("ROLE_" + user.getRole())))
                .build();
    }
}