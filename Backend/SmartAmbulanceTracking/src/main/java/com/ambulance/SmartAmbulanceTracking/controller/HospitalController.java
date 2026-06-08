package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.HospitalRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.HospitalResponseDTO;
import com.ambulance.SmartAmbulanceTracking.service.HospitalService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

	private final HospitalService hospitalService;

	// REGISTER A MEDICAL FACILITY
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<HospitalResponseDTO>> register(@RequestBody HospitalRequestDTO requestDTO) {
		HospitalResponseDTO response = hospitalService.registerHospital(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Hospital registry successfully updated.", response),
				HttpStatus.CREATED);
	}

	// GET HOSPITAL BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<HospitalResponseDTO>> getById(@PathVariable Long id) {
		HospitalResponseDTO response = hospitalService.getHospitalById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Hospital profile records loaded.", response));
	}

	// GET ALL REGISTERED HOSPITALS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<HospitalResponseDTO>>> getAll() {
		List<HospitalResponseDTO> response = hospitalService.getAllHospitals();
		return ResponseEntity.ok(new ApiResponse<>(true, "Global medical networks directory loaded.", response));
	}

	// UPDATE LIVE AVAILABLE BED CAPACITY COUNTS
	@PutMapping("/{id}/beds")
	public ResponseEntity<ApiResponse<HospitalResponseDTO>> updateBeds(@PathVariable Long id, @RequestParam int icuBeds,
			@RequestParam int generalBeds) {
		HospitalResponseDTO response = hospitalService.updateBedCount(id, icuBeds, generalBeds);
		return ResponseEntity.ok(new ApiResponse<>(true, "Live emergency bed counts successfully updated.", response));
	}

	// UPDATE EMERGENCY SERVICE AVAILABILITY
	@PutMapping("/{id}/availability")
	public ResponseEntity<ApiResponse<HospitalResponseDTO>> updateEmergencyStatus(@PathVariable Long id,
			@RequestParam boolean available) {
		HospitalResponseDTO response = hospitalService.updateEmergencyAvailability(id, available);
		String message = available ? "Emergency services marked as available."
				: "Emergency services marked as unavailable.";
		return ResponseEntity.ok(new ApiResponse<>(true, message, response));
	}
}