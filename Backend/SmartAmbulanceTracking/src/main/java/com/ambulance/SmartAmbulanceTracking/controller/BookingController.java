package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;
import com.ambulance.SmartAmbulanceTracking.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin
public class BookingController {

	@Autowired
	private BookingService service;

	// 🚑 Create Booking (Emergency Request)
	@PostMapping("/create")
	public ApiResponse<EmergencyRequest> create(@RequestBody EmergencyRequest request) {
		return new ApiResponse<>(true, "Booking created", service.createBooking(request));
	}

	// 📄 Get booking by ID
	@GetMapping("/{id}")
	public ApiResponse<EmergencyRequest> getById(@PathVariable Long id) {
		return new ApiResponse<>(true, "Booking found", service.getById(id));
	}

	// 📜 Get all bookings
	@GetMapping("/all")
	public ApiResponse<List<EmergencyRequest>> getAll() {
		return new ApiResponse<>(true, "All bookings", service.getAll());
	}

	// ❌ Cancel booking
	@PutMapping("/{id}/cancel")
	public ApiResponse<EmergencyRequest> cancel(@PathVariable Long id) {
		return new ApiResponse<>(true, "Booking cancelled", service.cancelBooking(id));
	}

	// 🔄 Update status (ASSIGNED / ARRIVED / COMPLETED)
	@PutMapping("/{id}/status")
	public ApiResponse<EmergencyRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
		return new ApiResponse<>(true, "Status updated", service.updateStatus(id, status));
	}
}
