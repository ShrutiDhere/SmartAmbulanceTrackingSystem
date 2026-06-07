package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;
import com.ambulance.SmartAmbulanceTracking.Service.EmergencyService;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin
public class EmergencyController {

	@Autowired
	private EmergencyService service;

	@PostMapping("/request")
	public ApiResponse<EmergencyRequest> create(@RequestBody EmergencyRequest request) {
		return new ApiResponse<>(true, "Emergency created", service.create(request));
	}
}