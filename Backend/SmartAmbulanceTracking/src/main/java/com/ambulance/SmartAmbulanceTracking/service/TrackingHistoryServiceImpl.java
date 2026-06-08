package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.Entity.TrackingHistory;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
import com.ambulance.SmartAmbulanceTracking.repository.TrackingHistoryRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TrackingHistoryServiceImpl implements TrackingHistoryService {

	private final TrackingHistoryRepository trackingRepository;

	private final AmbulanceRepository ambulanceRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public TrackingHistoryResponseDTO logLocation(TrackingHistoryRequestDTO requestDTO) {
		// 1. Verify that the target ambulance asset exists in the database
		// (Assuming Request DTO has an ambulanceId field now)
		Ambulance ambulance = ambulanceRepository.findById(requestDTO.getAmbulanceId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Telemetry Rejected: Ambulance asset missing with ID: " + requestDTO.getAmbulanceId()));

		// 2. Map telemetry parameters directly onto your exact TrackingHistory entity
		// fields
		TrackingHistory history = new TrackingHistory();
		history.setAmbulance(ambulance); // Uses your exact relationship setter
		history.setLatitude(requestDTO.getLatitude());
		history.setLongitude(requestDTO.getLongitude());
		history.setSpeed(requestDTO.getSpeed());
		history.setTimestamp(LocalDateTime.now());

		TrackingHistory savedHistory = trackingRepository.save(history);

		// 3. Sync the live telemetry variables on the main parent Ambulance record
		ambulance.setLatitude(requestDTO.getLatitude());
		ambulance.setLongitude(requestDTO.getLongitude());
		ambulance.setSpeed(requestDTO.getSpeed());
		// ambulance.setCurrentLocation(...) -> Removed this line since your entity
		// doesn't have it!

		ambulanceRepository.save(ambulance);

		return convertToResponseDTO(savedHistory);
	}

	@Override
	public List<TrackingHistoryResponseDTO> getRouteHistoryByAmbulanceId(Long ambulanceId) {
		if (!ambulanceRepository.existsById(ambulanceId)) {
			throw new ResourceNotFoundException("Query Aborted: Ambulance record missing with ID: " + ambulanceId);
		}

		return trackingRepository.findByAmbulanceIdOrderByTimestampAsc(ambulanceId).stream()
				.map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	private TrackingHistoryResponseDTO convertToResponseDTO(TrackingHistory history) {
		TrackingHistoryResponseDTO dto = modelMapper.map(history, TrackingHistoryResponseDTO.class);
		if (history.getAmbulance() != null) {
			dto.setAmbulanceId(history.getAmbulance().getId());
		}
		return dto;
	}
}