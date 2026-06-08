package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.BookingRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.*;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.*;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;

	private final EmergencyRequestRepository emergencyRepository;

	private final AmbulanceRepository ambulanceRepository;

	private final PatientRepository patientRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
		EmergencyRequest emergencyRequest = emergencyRepository.findById(requestDTO.getEmergencyRequestId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Emergency Request not found with ID: " + requestDTO.getEmergencyRequestId()));

		Patient patient = patientRepository.findById(requestDTO.getPatientId()).orElseThrow(
				() -> new ResourceNotFoundException("Patient record not found with ID: " + requestDTO.getPatientId()));

		// Strategy Pattern/Business Rule: Assign the first available dispatch vehicle
		Ambulance availableAmbulance = ambulanceRepository.findAll().stream()
				.filter(a -> a.getStatus() == AmbulanceStatus.AVAILABLE).findFirst()
				.orElseThrow(() -> new IllegalStateException("Dispatch Alert: No ambulances are currently available!"));

		Driver assignedDriver = availableAmbulance.getDriver();
		if (assignedDriver == null || !assignedDriver.isAvailable()) {
			throw new IllegalStateException(
					"Dispatch Assignment Error: Selected ambulance lacks an available designated driver.");
		}

		// Initialize state engine for booking lifecycle
		Booking booking = new Booking();
		booking.setEmergencyRequest(emergencyRequest);
		booking.setPatient(patient);
		booking.setAmbulance(availableAmbulance);
		booking.setDriver(assignedDriver);
		booking.setStatus(BookingStatus.ASSIGNED);

		// Mutate asset availability states
		availableAmbulance.setStatus(AmbulanceStatus.BUSY);
		assignedDriver.setAvailable(false);

		ambulanceRepository.save(availableAmbulance);
		Booking savedBooking = bookingRepository.save(booking);

		return modelMapper.map(savedBooking, BookingResponseDTO.class);
	}

	@Override
	@ReadOnlyProperty
	public BookingResponseDTO getBookingById(Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking record not found with ID: " + id));
		return modelMapper.map(booking, BookingResponseDTO.class);
	}

	@Override
	@ReadOnlyProperty
	public List<BookingResponseDTO> getAllBookings() {
		return bookingRepository.findAll().stream().map(booking -> modelMapper.map(booking, BookingResponseDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public BookingResponseDTO updateBookingStatus(Long id, BookingStatus status) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking record not found with ID: " + id));

		booking.setStatus(status);

		// Handle cascading structural resets if operational flow reaches termination
		// nodes
		if (status == BookingStatus.COMPLETED || status == BookingStatus.CANCELLED) {
			Ambulance ambulance = booking.getAmbulance();
			Driver driver = booking.getDriver();

			if (ambulance != null)
				ambulance.setStatus(AmbulanceStatus.AVAILABLE);
			if (driver != null)
				driver.setAvailable(true);
		}

		return modelMapper.map(bookingRepository.save(booking), BookingResponseDTO.class);
	}
}