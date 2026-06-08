package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyStatus;
import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.EmergencyRequestRepository;
import com.ambulance.SmartAmbulanceTracking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EmergencyRequestServiceImpl implements EmergencyRequestService {

	private final EmergencyRequestRepository emergencyRepository;

	private final UserRepository userRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public EmergencyResponseDTO createEmergencyRequest(EmergencyRequestDTO requestDTO) {
		// Validate user reporter profile exists
		User user = userRepository.findById(requestDTO.getUserId()).orElseThrow(() -> new ResourceNotFoundException(
				"Incident Rejected: Reporting User profile not found with ID: " + requestDTO.getUserId()));

		EmergencyRequest request = new EmergencyRequest();
		request.setPickupLat(requestDTO.getPickupLat());
		request.setPickupLng(requestDTO.getPickupLng());
		request.setUser(user);

		// Auto-assign operational metadata tags
		request.setStatus(EmergencyStatus.PENDING);
		request.setCreatedAt(LocalDateTime.now());

		EmergencyRequest savedRequest = emergencyRepository.save(request);
		return convertToResponseDTO(savedRequest);
	}

	@Override
	public EmergencyResponseDTO getEmergencyRequestById(Long id) {
		EmergencyRequest request = emergencyRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Emergency incident record not found with ID: " + id));
		return convertToResponseDTO(request);
	}

	@Override
	public List<EmergencyResponseDTO> getAllEmergencyRequests() {
		return emergencyRepository.findAll().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public EmergencyResponseDTO updateEmergencyStatus(Long id, EmergencyStatus status) {
		EmergencyRequest request = emergencyRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Status rewrite rejected: Incident not found with ID: " + id));

		request.setStatus(status);
		return convertToResponseDTO(emergencyRepository.save(request));
	}

	private EmergencyResponseDTO convertToResponseDTO(EmergencyRequest request) {
		EmergencyResponseDTO dto = modelMapper.map(request, EmergencyResponseDTO.class);
		if (request.getUser() != null) {
			dto.setUserId(request.getUser().getId());
			dto.setUserName(request.getUser().getName());
		}
		return dto;
	}
}