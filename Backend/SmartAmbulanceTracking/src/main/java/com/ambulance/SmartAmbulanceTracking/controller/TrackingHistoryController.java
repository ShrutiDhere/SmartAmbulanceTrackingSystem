package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryResponseDTO;

import com.ambulance.SmartAmbulanceTracking.service.TrackingHistoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tracking-history")
@CrossOrigin(origins = "*")
public class TrackingHistoryController {

	private final TrackingHistoryService trackingService;

	// Log ambulance location
	@PostMapping("/log")
	public ResponseEntity<ApiResponse<TrackingHistoryResponseDTO>> logPing(
			@RequestBody TrackingHistoryRequestDTO requestDTO) {
		TrackingHistoryResponseDTO response = trackingService.logLocation(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Location logged successfully.", response),
				HttpStatus.CREATED);
	}

	// Get route history by ambulance ID
	@GetMapping("/ambulance/{ambulanceId}")
	public ResponseEntity<ApiResponse<List<TrackingHistoryResponseDTO>>> getRouteTrail(@PathVariable Long ambulanceId) {
		List<TrackingHistoryResponseDTO> response = trackingService.getRouteHistoryByAmbulanceId(ambulanceId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Route history retrieved successfully.", response));
	}
}