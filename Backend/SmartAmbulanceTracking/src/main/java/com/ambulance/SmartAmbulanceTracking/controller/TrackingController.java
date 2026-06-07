package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.service.TrackingService;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin
public class TrackingController {

	@Autowired
	private TrackingService service;

	@PostMapping("/update")
	public ApiResponse<String> update(@RequestParam Long ambulanceId, @RequestParam double lat,
			@RequestParam double lng, @RequestParam double speed) {

		service.updateLocation(ambulanceId, lat, lng, speed);

		return new ApiResponse<>(true, "Location updated", null);
	}
}