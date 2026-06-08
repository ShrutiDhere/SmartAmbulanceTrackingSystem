package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.PatientRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PatientResponseDTO;
import java.util.List;

public interface PatientService {
	PatientResponseDTO registerPatient(PatientRequestDTO requestDTO);

	PatientResponseDTO getPatientById(Long id);

	List<PatientResponseDTO> getAllPatients();

	PatientResponseDTO updatePatientVitals(Long id, String vitals, String emergencyLevel);
}