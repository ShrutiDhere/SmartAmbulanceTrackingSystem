package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.BookingRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.BookingStatus;
import com.ambulance.SmartAmbulanceTracking.service.BookingService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

	private final BookingService bookingService;

	// CREATE BOOKING
	@PostMapping("/dispatch")
	public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(@RequestBody BookingRequestDTO requestDTO) {
		BookingResponseDTO response = bookingService.createBooking(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Booking created successfully.", response),
				HttpStatus.CREATED);
	}

	// GET BOOKING BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingById(@PathVariable Long id) {
		BookingResponseDTO response = bookingService.getBookingById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Booking details retrieved successfully.", response));
	}

	// GET ALL BOOKINGS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getAllBookings() {
		List<BookingResponseDTO> response = bookingService.getAllBookings();
		return ResponseEntity.ok(new ApiResponse<>(true, "All booking records retrieved successfully.", response));
	}

	// UPDATE BOOKING STATUS
	@PutMapping("/{id}/status")
	public ResponseEntity<ApiResponse<BookingResponseDTO>> updateStatus(@PathVariable Long id,
			@RequestParam BookingStatus status) {
		BookingResponseDTO response = bookingService.updateBookingStatus(id, status);
		return ResponseEntity.ok(new ApiResponse<>(true, "Booking status updated to: " + status, response));
	}
	//  get  getActiveDriverBookings
    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getActiveDriverBookings(@PathVariable Long driverId) {
        List<BookingResponseDTO> response = bookingService.getActiveBookingsForDriver(driverId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Active driver assignments retrieved successfully.", response));
    }
}