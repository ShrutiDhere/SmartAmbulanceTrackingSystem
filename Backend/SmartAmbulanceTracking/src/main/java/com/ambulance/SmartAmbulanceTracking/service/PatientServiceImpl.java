package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.PatientRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PatientResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Patient;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PatientServiceImpl implements PatientService {

	private final PatientRepository patientRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public PatientResponseDTO registerPatient(PatientRequestDTO requestDTO) {
		Patient patient = modelMapper.map(requestDTO, Patient.class);
		Patient savedPatient = patientRepository.save(patient);
		return modelMapper.map(savedPatient, PatientResponseDTO.class);
	}

	@Override
	public PatientResponseDTO getPatientById(Long id) {
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Patient medical file missing with ID: " + id));
		return modelMapper.map(patient, PatientResponseDTO.class);
	}

	@Override
	public List<PatientResponseDTO> getAllPatients() {
		return patientRepository.findAll().stream().map(patient -> modelMapper.map(patient, PatientResponseDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public PatientResponseDTO updatePatientVitals(Long id, String vitals, String emergencyLevel) {
		Patient patient = patientRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Triage update denied: Patient record missing with ID: " + id));

		patient.setVitals(vitals);
		patient.setEmergencyLevel(emergencyLevel);

		return modelMapper.map(patientRepository.save(patient), PatientResponseDTO.class);
	}
}