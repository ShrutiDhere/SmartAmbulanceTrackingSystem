package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.DriverRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.DriverResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Driver;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.DriverRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DriverServiceImpl implements DriverService {

	private final DriverRepository driverRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public DriverResponseDTO registerDriver(DriverRequestDTO requestDTO) {
		Driver driver = new Driver();
		driver.setName(requestDTO.getName());
		driver.setPhoneNumber(requestDTO.getPhoneNumber());
		driver.setEmail(requestDTO.getEmail());
		driver.setLicenseNumber(requestDTO.getLicenseNumber());

		// Default lifecycle status initialization
		driver.setAvailable(true);

		Driver savedDriver = driverRepository.save(driver);
		return convertToResponseDTO(savedDriver);
	}

	@Override
	public DriverResponseDTO getDriverById(Long id) {
		Driver driver = driverRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Driver profile record not found with ID: " + id));
		return convertToResponseDTO(driver);
	}

	@Override
	public List<DriverResponseDTO> getAllDrivers() {
		return driverRepository.findAll().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public DriverResponseDTO updateAvailability(Long id, boolean available) {
		Driver driver = driverRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Status adjustment rejected: Driver not found with ID: " + id));

		driver.setAvailable(available);
		return convertToResponseDTO(driverRepository.save(driver));
	}

	// Explicit converter mapping to safely query matching ambulance metadata
	private DriverResponseDTO convertToResponseDTO(Driver driver) {
		DriverResponseDTO dto = modelMapper.map(driver, DriverResponseDTO.class);
		if (driver.getAmbulance() != null) {
			dto.setAmbulanceId(driver.getAmbulance().getId());
			dto.setVehicleNumber(driver.getAmbulance().getVehicleNumber());
		}
		return dto;
	}
}