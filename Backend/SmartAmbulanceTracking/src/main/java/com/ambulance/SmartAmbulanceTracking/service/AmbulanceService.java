package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.AmbulanceResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;
import java.util.List;

public interface AmbulanceService {
    AmbulanceResponseDTO registerAmbulance(AmbulanceRequestDTO requestDTO);
    AmbulanceResponseDTO getAmbulanceById(Long id);
    List<AmbulanceResponseDTO> getAllAmbulances();
    AmbulanceResponseDTO updateLocation(Long id, double latitude, double longitude, double speed, String locationName);
    AmbulanceResponseDTO updateStatus(Long id, AmbulanceStatus status);
}