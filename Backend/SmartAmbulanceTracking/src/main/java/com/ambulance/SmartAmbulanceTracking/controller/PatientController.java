package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Patient;
import com.ambulance.SmartAmbulanceTracking.service.PatientService;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin
public class PatientController {

	@Autowired
	private PatientService service;

	@GetMapping("/all")
	public ApiResponse<List<Patient>> getAll() {
		return new ApiResponse<>(true, "Patients fetched", service.getAll());
	}

	@PostMapping("/save")
	public ApiResponse<Patient> save(@RequestBody Patient patient) {
		return new ApiResponse<>(true, "Patient saved", service.save(patient));
	}
}