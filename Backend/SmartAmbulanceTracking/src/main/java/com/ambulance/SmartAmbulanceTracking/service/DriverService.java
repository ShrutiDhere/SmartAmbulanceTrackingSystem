package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.DriverRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.DriverResponseDTO;
import java.util.List;

public interface DriverService {
    DriverResponseDTO registerDriver(DriverRequestDTO requestDTO);
    DriverResponseDTO getDriverById(Long id);
    List<DriverResponseDTO> getAllDrivers();
    DriverResponseDTO updateAvailability(Long id, boolean available);
}