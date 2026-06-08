package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.EmergencyResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyStatus;
import java.util.List;

public interface EmergencyRequestService {
    EmergencyResponseDTO createEmergencyRequest(EmergencyRequestDTO requestDTO);
    EmergencyResponseDTO getEmergencyRequestById(Long id);
    List<EmergencyResponseDTO> getAllEmergencyRequests();
    EmergencyResponseDTO updateEmergencyStatus(Long id, EmergencyStatus status);
}