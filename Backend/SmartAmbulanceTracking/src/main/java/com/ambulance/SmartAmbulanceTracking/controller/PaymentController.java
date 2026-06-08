package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.PaymentRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PaymentResponseDTO;

import com.ambulance.SmartAmbulanceTracking.service.PaymentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

	private final PaymentService paymentService;

	// PROCESS PAYMENT FOR A BOOKING
	@PostMapping("/pay")
	public ResponseEntity<ApiResponse<PaymentResponseDTO>> pay(@RequestBody PaymentRequestDTO requestDTO) {
		PaymentResponseDTO response = paymentService.processPayment(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Payment processed successfully.", response),
				HttpStatus.CREATED);
	}

	// GET PAYMENT DETAILS BY PAYMENT ID
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<PaymentResponseDTO>> getById(@PathVariable Long id) {
		PaymentResponseDTO response = paymentService.getPaymentById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Payment details retrieved successfully.", response));
	}

	// GET ALL PAYMENT RECORDS
	@GetMapping("/all")
	public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getAll() {
		List<PaymentResponseDTO> response = paymentService.getAllPayments();
		return ResponseEntity.ok(new ApiResponse<>(true, "Payment records retrieved successfully.", response));
	}
}