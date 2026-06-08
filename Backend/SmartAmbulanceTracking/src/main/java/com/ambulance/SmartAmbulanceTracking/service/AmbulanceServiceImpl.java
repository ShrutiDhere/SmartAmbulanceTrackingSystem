package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.*;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
import com.ambulance.SmartAmbulanceTracking.repository.DriverRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AmbulanceServiceImpl implements AmbulanceService {

	private final AmbulanceRepository ambulanceRepository;

	private final DriverRepository driverRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public AmbulanceResponseDTO registerAmbulance(AmbulanceRequestDTO requestDTO) {
		Driver driver = driverRepository.findById(requestDTO.getDriverId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Registration Denied: Driver not found with ID: " + requestDTO.getDriverId()));

		Ambulance ambulance = new Ambulance();
		ambulance.setVehicleNumber(requestDTO.getVehicleNumber());
		ambulance.setDriver(driver);
		ambulance.setLatitude(requestDTO.getLatitude());
		ambulance.setLongitude(requestDTO.getLongitude());
		ambulance.setSpeed(0.0);
		ambulance.setCurrentLocation("Base Station");

		// Default initial setup states
		ambulance.setStatus(AmbulanceStatus.AVAILABLE);
		ambulance.setLastUpdated(LocalDateTime.now());

		Ambulance savedAmbulance = ambulanceRepository.save(ambulance);
		return convertToResponseDTO(savedAmbulance);
	}

	@Override
	public AmbulanceResponseDTO getAmbulanceById(Long id) {
		Ambulance ambulance = ambulanceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Ambulance asset record not found with ID: " + id));
		return convertToResponseDTO(ambulance);
	}

	@Override
	public List<AmbulanceResponseDTO> getAllAmbulances() {
		return ambulanceRepository.findAll().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public AmbulanceResponseDTO updateLocation(Long id, double latitude, double longitude, double speed,
			String locationName) {
		Ambulance ambulance = ambulanceRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Telemetry failure: Ambulance not found with ID: " + id));

		ambulance.setLatitude(latitude);
		ambulance.setLongitude(longitude);
		ambulance.setSpeed(speed);
		ambulance.setCurrentLocation(locationName);
		ambulance.setLastUpdated(LocalDateTime.now());

		return convertToResponseDTO(ambulanceRepository.save(ambulance));
	}

	@Override
	@Transactional
	public AmbulanceResponseDTO updateStatus(Long id, AmbulanceStatus status) {
		Ambulance ambulance = ambulanceRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Status update rejected: Ambulance not found with ID: " + id));

		ambulance.setStatus(status);
		ambulance.setLastUpdated(LocalDateTime.now());

		return convertToResponseDTO(ambulanceRepository.save(ambulance));
	}

	// Manual mapping layer fallback to cleanly link flat properties and avoid
	// ModelMapper edge crashes
	private AmbulanceResponseDTO convertToResponseDTO(Ambulance ambulance) {
		AmbulanceResponseDTO dto = modelMapper.map(ambulance, AmbulanceResponseDTO.class);
		if (ambulance.getDriver() != null) {
			dto.setDriverId(ambulance.getDriver().getId());
			dto.setDriverName(ambulance.getDriver().getName());
			dto.setDriverPhone(ambulance.getDriver().getPhoneNumber());
		}
		return dto;
	}
}