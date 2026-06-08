package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.PaymentRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PaymentResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Booking;
import com.ambulance.SmartAmbulanceTracking.Entity.Payment;
import com.ambulance.SmartAmbulanceTracking.Entity.PaymentStatus;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.BookingRepository;
import com.ambulance.SmartAmbulanceTracking.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;

	private final BookingRepository bookingRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO) {
		// Validate that the transaction matches an active dispatch booking record
		Booking booking = bookingRepository.findById(requestDTO.getBookingId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Payment target failed: Booking record not found with ID: " + requestDTO.getBookingId()));

		Payment payment = new Payment();
		payment.setBooking(booking);
		payment.setAmount(requestDTO.getAmount());
		payment.setPaymentMethod(requestDTO.getPaymentMethod());
		payment.setTransactionId(requestDTO.getTransactionId());

		// Execute state changes safely using the Enum type definitions
		payment.setPaymentStatus(PaymentStatus.SUCCESS);
		payment.setPaymentTime(LocalDateTime.now());

		Payment savedPayment = paymentRepository.save(payment);

		return convertToResponseDTO(savedPayment);
	}

	@Override
	public PaymentResponseDTO getPaymentById(Long id) {
		Payment payment = paymentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Payment record not found with ID: " + id));
		return convertToResponseDTO(payment);
	}

	@Override
	public List<PaymentResponseDTO> getAllPayments() {
		return paymentRepository.findAll().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	private PaymentResponseDTO convertToResponseDTO(Payment payment) {
		PaymentResponseDTO dto = modelMapper.map(payment, PaymentResponseDTO.class);
		if (payment.getBooking() != null) {
			dto.setBookingId(payment.getBooking().getId());
		}
		return dto;
	}
}