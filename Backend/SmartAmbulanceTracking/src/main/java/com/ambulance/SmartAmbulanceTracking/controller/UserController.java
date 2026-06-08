package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;

import com.ambulance.SmartAmbulanceTracking.DTO.UserResponseDTO;

import com.ambulance.SmartAmbulanceTracking.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

	private final UserService userService;

	// Retrieve user details by ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponseDTO>> getById(@PathVariable Long id) {
		UserResponseDTO response = userService.getUserById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "User details retrieved successfully.", response));
	}

	// Retrieve all users
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAll() {
		List<UserResponseDTO> response = userService.getAllUsers();
		return ResponseEntity.ok(new ApiResponse<>(true, "All users retrieved successfully.", response));
	}

	// Update user's role (Admin only)
	@PutMapping("/{id}/role")
	public ResponseEntity<ApiResponse<UserResponseDTO>> changeRole(@PathVariable Long id, @RequestParam String role) {
		UserResponseDTO response = userService.updateUserRole(id, role);
		return ResponseEntity.ok(new ApiResponse<>(true, "User role updated to: " + role.toUpperCase(), response));
	}

	// Delete user by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "User account deleted successfully.", null));
	}
}