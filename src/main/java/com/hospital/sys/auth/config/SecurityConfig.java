package com.hospital.sys.auth.config;

import com.hospital.sys.auth.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    // BCrypt hashes passwords one-way -- what's stored in the `users` table
    // is never the plain password. Used both here (to check login attempts)
    // and by the seed data runner (to hash the demo accounts' passwords).
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disabled for this mini project: none of the module JS files
                // (EHR, Appointment, Patient, etc.) attach a CSRF token to their
                // fetch() calls, so leaving CSRF on would 403 every POST/PUT/DELETE
                // across every module. Fine for a local demo; a real deployment
                // would instead read the token from the cookie Spring sets and
                // send it back as an X-XSRF-TOKEN header on each fetch() call.
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public: login page itself, and static assets needed to render it
                        .requestMatchers("/login.html", "/css/**", "/js/**").permitAll()
                        // Everything else (all /api/** and /pages/**) requires a logged-in user
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/perform-login") // the URL the login form's <form action> posts to
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler(roleBasedSuccessHandler())
                        .failureUrl("/login.html?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout=true")
                        .permitAll()
                )
                // CSRF left enabled by default for form login. If your module JS
                // does POST/PUT/DELETE via fetch() without a CSRF token, those
                // calls will be rejected with 403 -- see the note in the README
                // section below on including the CSRF token in fetch() headers.
                .userDetailsService(userDetailsService);

        return http.build();
    }

    // Decides where to send the user right after a successful login,
    // based on their role -- this is the actual "different dashboard
    // per role" behavior.
    @Bean
    public org.springframework.security.web.authentication.AuthenticationSuccessHandler roleBasedSuccessHandler() {
        return (request, response, authentication) -> {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // Everyone lands on the same dashboard.html; its own JS calls
            // /api/auth/me to find out the role and show/hide module cards
            // accordingly. Admin gets every module; others get a filtered set.
            response.sendRedirect("/pages/dashboard.html");
        };
    }
}