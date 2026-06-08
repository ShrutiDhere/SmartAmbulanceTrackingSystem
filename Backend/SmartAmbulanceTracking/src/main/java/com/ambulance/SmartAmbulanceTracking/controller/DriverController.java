package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.DriverRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.DriverResponseDTO;
import com.ambulance.SmartAmbulanceTracking.service.DriverService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

	private final DriverService driverService;

	// REGISTER NEW DRIVER
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<DriverResponseDTO>> register(@RequestBody DriverRequestDTO requestDTO) {
		DriverResponseDTO response = driverService.registerDriver(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Driver registered successfully", response),
				HttpStatus.CREATED);
	}

	// GET DRIVER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<DriverResponseDTO>> getById(@PathVariable Long id) {
		DriverResponseDTO response = driverService.getDriverById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Driver details retrieved successfully", response));
	}

	// GET ALL DRIVERS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<DriverResponseDTO>>> getAll() {
		List<DriverResponseDTO> response = driverService.getAllDrivers();
		return ResponseEntity.ok(new ApiResponse<>(true, "Driver details retrieved successfully", response));
	}

	// UPDATE DRIVER AVAILABILITY
	@PutMapping("/{id}/availability")
	public ResponseEntity<ApiResponse<DriverResponseDTO>> updateAvailability(@PathVariable Long id,
			@RequestParam boolean available) {
		DriverResponseDTO response = driverService.updateAvailability(id, available);
		String message = available ? "Driver marked as available successfully"
				: "Driver marked as unavailable successfully";
		return ResponseEntity.ok(new ApiResponse<>(true, message, response));
	}
}