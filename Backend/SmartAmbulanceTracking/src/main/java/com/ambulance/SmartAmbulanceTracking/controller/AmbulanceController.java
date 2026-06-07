package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.service.AmbulanceService;

import java.util.List;

@RestController
@RequestMapping("/api/ambulance")
@CrossOrigin
public class AmbulanceController {

	@Autowired
	private AmbulanceService service;

	@GetMapping("/all")
	public ApiResponse<List<Ambulance>> getAll() {
		return new ApiResponse<>(true, "Ambulances fetched", service.getAll());
	}

	@GetMapping("/nearby")
	public ApiResponse<List<Ambulance>> nearby(@RequestParam double lat, @RequestParam double lng) {
		return new ApiResponse<>(true, "Nearby ambulances", service.findNearby(lat, lng));
	}

	@PutMapping("/{id}/status")
	public ApiResponse<Ambulance> updateStatus(@PathVariable Long id, @RequestParam String status) {
		return new ApiResponse<>(true, "Status updated", service.updateStatus(id, status));
	}
}