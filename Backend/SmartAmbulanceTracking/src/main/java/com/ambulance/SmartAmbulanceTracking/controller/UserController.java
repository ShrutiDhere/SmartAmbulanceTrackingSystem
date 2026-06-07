package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.Service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired	
    private UserService service;

    @GetMapping("/all")
    public ApiResponse<List<User>> getAll() {
        return new ApiResponse<>(true, "Users fetched", service.getAll());
    }

    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody User user) {
        return new ApiResponse<>(true, "User registered successfully",
                service.save(user));
    }

    // 🔥 LOGIN FIXED (NO 500 ERROR NOW)
    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody User user) {
        return new ApiResponse<>(true, "Login successful",
                service.login(user.getEmail(), user.getPassword()));
    }

    @GetMapping("/{id}")
    public ApiResponse<User> getById(@PathVariable Long id) {
        return new ApiResponse<>(true, "User found",
                service.getById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        service.delete(id);
        return new ApiResponse<>(true, "User deleted", null);
    }
}