package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.PatientRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PatientResponseDTO;

import com.ambulance.SmartAmbulanceTracking.service.PatientService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

	private final PatientService patientService;

	// REGISTER A NEW PATIENT
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<PatientResponseDTO>> register(@RequestBody PatientRequestDTO requestDTO) {
		PatientResponseDTO response = patientService.registerPatient(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Patient registered successfully.", response),
				HttpStatus.CREATED);
	}

	// GET PATIENT DETAILS BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<PatientResponseDTO>> getById(@PathVariable Long id) {
		PatientResponseDTO response = patientService.getPatientById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Patient details retrieved successfully.", response));
	}

	// GET ALL PATIENTS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<PatientResponseDTO>>> getAll() {
		List<PatientResponseDTO> response = patientService.getAllPatients();
		return ResponseEntity.ok(new ApiResponse<>(true, "Patient records retrieved successfully.", response));
	}

	// UPDATE PATIENT VITALS AND EMERGENCY LEVEL
	@PutMapping("/{id}/vitals")
	public ResponseEntity<ApiResponse<PatientResponseDTO>> updateVitals(@PathVariable Long id,
			@RequestParam String vitals, @RequestParam String emergencyLevel) {
		PatientResponseDTO response = patientService.updatePatientVitals(id, vitals, emergencyLevel);
		return ResponseEntity.ok(new ApiResponse<>(true, "Patient vitals updated successfully.", response));
	}
}