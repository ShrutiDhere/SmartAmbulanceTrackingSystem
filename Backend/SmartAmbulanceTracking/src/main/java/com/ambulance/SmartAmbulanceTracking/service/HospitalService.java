package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.HospitalRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.HospitalResponseDTO;
import java.util.List;

public interface HospitalService {
	HospitalResponseDTO registerHospital(HospitalRequestDTO requestDTO);

	HospitalResponseDTO getHospitalById(Long id);

	List<HospitalResponseDTO> getAllHospitals();

	HospitalResponseDTO updateBedCount(Long id, int icuBeds, int generalBeds);

	HospitalResponseDTO updateEmergencyAvailability(Long id, boolean isAvailable);
}