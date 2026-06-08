package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyStatus;
import com.ambulance.SmartAmbulanceTracking.service.EmergencyRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/emergency-requests")
@CrossOrigin(origins = "*")
public class EmergencyRequestController {

	private final EmergencyRequestService emergencyService;

	// CREATE A NEW EMERGENCY REQUEST
	@PostMapping("/raise")
	public ResponseEntity<ApiResponse<EmergencyResponseDTO>> raiseEmergency(
			@RequestBody EmergencyRequestDTO requestDTO) {
		EmergencyResponseDTO response = emergencyService.createEmergencyRequest(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Emergency request created successfully", response),
				HttpStatus.CREATED);
	}

	// GET EMERGENCY REQUEST BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<EmergencyResponseDTO>> getById(@PathVariable Long id) {
		EmergencyResponseDTO response = emergencyService.getEmergencyRequestById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Emergency request fetched successfully", response));
	}

	// GET ALL EMERGENCY REQUESTS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<EmergencyResponseDTO>>> getAll() {
		List<EmergencyResponseDTO> response = emergencyService.getAllEmergencyRequests();
		return ResponseEntity.ok(new ApiResponse<>(true, "Emergency requests retrieved successfully", response));
	}

	// UPDATE EMERGENCY STATUS
	@PutMapping("/{id}/status")
	public ResponseEntity<ApiResponse<EmergencyResponseDTO>> updateStatus(@PathVariable Long id,
			@RequestParam EmergencyStatus status) {
		EmergencyResponseDTO response = emergencyService.updateEmergencyStatus(id, status);
		return ResponseEntity.ok(new ApiResponse<>(true, "Emergency status updated successfully :" + status, response));
	}
}