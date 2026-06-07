package com.ambulance.SmartAmbulanceTracking.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.Service.UserService;
import com.ambulance.SmartAmbulanceTracking.security.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {

        User savedUser = userService.register(user);

        return ResponseEntity.ok(savedUser);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        User loggedInUser = userService.login(
                user.getEmail(),
                user.getPassword()
        );

        String token = jwtUtil.generateToken(
                loggedInUser.getEmail()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("token", token);
        response.put("id", loggedInUser.getId());
        response.put("name", loggedInUser.getName());
        response.put("email", loggedInUser.getEmail());

        return ResponseEntity.ok(response);
    }
}