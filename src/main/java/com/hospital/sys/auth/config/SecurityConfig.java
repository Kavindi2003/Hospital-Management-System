package com.hospital.sys.auth.config;

import com.hospital.sys.auth.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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

                        // Dashboard + "who am I" endpoint: any logged-in user, any role
                        .requestMatchers("/pages/dashboard.html", "/api/auth/me").authenticated()

                        // Creating, listing, and deleting accounts are all admin-only actions
                        .requestMatchers("/api/auth/register", "/api/auth/users/**").hasRole("ADMIN")

                        // ---- Role-specific pages ----
                        // These match dashboard.html's own MODULES list, so what a role
                        // can SEE (the module card) and what they can actually OPEN agree.
                        .requestMatchers("/pages/staff.html").hasRole("ADMIN")
                        .requestMatchers("/pages/ehr.html").hasAnyRole("ADMIN", "DOCTOR")
                        .requestMatchers("/pages/ward.html", "/pages/inventory.html")
                        .hasAnyRole("ADMIN", "NURSE")
                        .requestMatchers("/pages/billing.html").hasAnyRole("ADMIN", "RECEPTIONIST")
                        .requestMatchers("/pages/appointment.html")
                        .hasAnyRole("ADMIN", "DOCTOR", "RECEPTIONIST")
                        .requestMatchers("/pages/patient.html")
                        .hasAnyRole("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST")

                        // ---- Role-specific APIs (the part that actually matters --
                        // without this, someone could bypass the hidden module card
                        // entirely by calling the API directly, e.g. via curl/Postman) ----
                        .requestMatchers("/staff/**").hasRole("ADMIN")
                        .requestMatchers("/api/medical-records/**").hasAnyRole("ADMIN", "DOCTOR")
                        .requestMatchers("/api/wards/**", "/api/allocations/**", "/api/inventory/**")
                        .hasAnyRole("ADMIN", "NURSE")
                        .requestMatchers("/api/bills/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                        .requestMatchers("/api/appointments/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "RECEPTIONIST")
                        .requestMatchers("/api/patients/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST")

                        // Anything else not listed above still just requires login
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
                // Access-denied case: a logged-in user hitting a page/API their role
                // doesn't cover (e.g. a Nurse requesting /api/bills/**) gets a plain
                // 403 rather than being silently redirected anywhere.
                .exceptionHandling(ex -> ex
                        .accessDeniedPage("/login.html?denied=true")
                )
                .userDetailsService(userDetailsService);

        return http.build();
    }

    // Decides where to send the user right after a successful login.
    // Everyone lands on the same dashboard.html; its own JS calls
    // /api/auth/me to find out the role and show/hide module cards
    // accordingly. Admin gets every module; others get a filtered set.
    // (The actual enforcement now also happens server-side above --
    // this redirect just picks the landing page, it isn't the security boundary.)
    @Bean
    public org.springframework.security.web.authentication.AuthenticationSuccessHandler roleBasedSuccessHandler() {
        return (request, response, authentication) ->
                response.sendRedirect("/pages/dashboard.html");
    }
}