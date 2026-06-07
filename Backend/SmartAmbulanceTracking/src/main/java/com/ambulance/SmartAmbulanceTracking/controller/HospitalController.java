package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;
import com.ambulance.SmartAmbulanceTracking.service.HospitalService;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin
public class HospitalController {

	@Autowired
	private HospitalService service;

	@GetMapping("/all")
	public ApiResponse<List<Hospital>> getAll() {
		return new ApiResponse<>(true, "Hospitals fetched", service.getAll());
	}

	@GetMapping("/available")
	public ApiResponse<List<Hospital>> getAvailable() {
		return new ApiResponse<>(true, "Available hospitals", service.getAvailable());
	}
}