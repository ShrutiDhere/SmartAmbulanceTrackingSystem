package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;
import com.ambulance.SmartAmbulanceTracking.service.AmbulanceService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/ambulances")
@CrossOrigin(origins = "*")
public class AmbulanceController {

	private final AmbulanceService ambulanceService;

	// REGISTER NEW AMBULANCE
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> register(@RequestBody AmbulanceRequestDTO requestDTO) {
		AmbulanceResponseDTO response = ambulanceService.registerAmbulance(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Ambulance registered successfully.", response),
				HttpStatus.CREATED);
	}

	// GET AMBULANCE BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> getById(@PathVariable Long id) {
		AmbulanceResponseDTO response = ambulanceService.getAmbulanceById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Ambulance details retrieved successfully.", response));
	}

	// GET ALL AMBULANCES
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<AmbulanceResponseDTO>>> getAll() {
		List<AmbulanceResponseDTO> response = ambulanceService.getAllAmbulances();
		return ResponseEntity.ok(new ApiResponse<>(true, "Ambulances retrieved successfully.", response));
	}

	// UPDATE AMBULANCE LOCATION
	@PutMapping("/{id}/location")
	public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> updateLocation(@PathVariable Long id,
			@RequestParam double latitude, @RequestParam double longitude, @RequestParam double speed,
			@RequestParam String locationName) {
		AmbulanceResponseDTO response = ambulanceService.updateLocation(id, latitude, longitude, speed, locationName);
		return ResponseEntity.ok(new ApiResponse<>(true, "Location updated successfully.", response));
	}

	// UPDATE AMBULANCE STATUS
	@PutMapping("/{id}/status")
	public ResponseEntity<ApiResponse<AmbulanceResponseDTO>> updateStatus(@PathVariable Long id,
			@RequestParam AmbulanceStatus status) {
		AmbulanceResponseDTO response = ambulanceService.updateStatus(id, status);
		return ResponseEntity.ok(new ApiResponse<>(true, "Ambulance status updated to: " + status, response));
	}
}