package com.ambulance.SmartAmbulanceTracking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/api/**",
                        // 🚨 FIX: Allows the real-time handshake request to bypass security filters
                        "/ambulance-tracking",
                        "/ambulance-tracking/**"
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}