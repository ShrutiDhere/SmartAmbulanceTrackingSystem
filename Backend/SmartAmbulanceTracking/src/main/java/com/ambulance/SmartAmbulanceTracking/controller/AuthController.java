package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.AuthResponseDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.LoginRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.UserRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.UserResponseDTO;
import com.ambulance.SmartAmbulanceTracking.security.JwtUtil;
import com.ambulance.SmartAmbulanceTracking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	private final UserService userService;

	private final JwtUtil jwtUtil;

	// REGISTER USER
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(@Valid @RequestBody UserRequestDTO requestDTO) {
		// Keeps everything safe by utilizing the DTO layer instead of direct entity
		// mapping
		UserResponseDTO savedUser = userService.registerUser(requestDTO);

		return new ResponseEntity<>(new ApiResponse<>(true, "User authentication generated successfully.", savedUser),
				HttpStatus.CREATED);
	}

	// LOGIN USER
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponseDTO>> loginUser(@RequestBody LoginRequestDTO loginDTO) {
		// Step A: Pass primitive credentials down to service layer identity
		// verification routine
		UserResponseDTO loggedInUser = userService.login(loginDTO.getEmail(), loginDTO.getPassword());

		// Step B: Issue signed cryptographic bearer tokens upon successful verification
		// pass
		String token = jwtUtil.generateToken(loggedInUser.getEmail());

		// Step C: Assemble secure response envelope properties payload
		AuthResponseDTO authResponse = new AuthResponseDTO();
		authResponse.setToken(token);
		authResponse.setId(loggedInUser.getId());
		authResponse.setName(loggedInUser.getName());
		authResponse.setEmail(loggedInUser.getEmail());
		authResponse.setRole(loggedInUser.getRole());

		return ResponseEntity.ok(new ApiResponse<>(true, "Login successful.", authResponse));
	}
}