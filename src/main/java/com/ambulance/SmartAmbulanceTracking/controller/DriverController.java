package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Driver;

import com.ambulance.SmartAmbulanceTracking.Service.DriverService;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin
public class DriverController {

	@Autowired
	private DriverService service;

	@GetMapping("/all")
	public ApiResponse<List<Driver>> getAll() {
		return new ApiResponse<>(true, "Drivers fetched", service.getAll());
	}

	@PutMapping("/{id}/availability")
	public ApiResponse<Driver> update(@PathVariable Long id, @RequestParam boolean status) {
		return new ApiResponse<>(true, "Availability updated", service.updateAvailability(id, status));
	}
}