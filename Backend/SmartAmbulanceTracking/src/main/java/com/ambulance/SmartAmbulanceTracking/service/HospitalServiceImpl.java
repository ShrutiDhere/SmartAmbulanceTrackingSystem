package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.HospitalRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.HospitalResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.HospitalRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class HospitalServiceImpl implements HospitalService {

	private final HospitalRepository hospitalRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public HospitalResponseDTO registerHospital(HospitalRequestDTO requestDTO) {
		Hospital hospital = modelMapper.map(requestDTO, Hospital.class);
		Hospital savedHospital = hospitalRepository.save(hospital);
		return modelMapper.map(savedHospital, HospitalResponseDTO.class);
	}

	@Override
	public HospitalResponseDTO getHospitalById(Long id) {
		Hospital hospital = hospitalRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Hospital directory entry not found with ID: " + id));
		return modelMapper.map(hospital, HospitalResponseDTO.class);
	}

	@Override
	public List<HospitalResponseDTO> getAllHospitals() {
		return hospitalRepository.findAll().stream()
				.map(hospital -> modelMapper.map(hospital, HospitalResponseDTO.class)).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public HospitalResponseDTO updateBedCount(Long id, int icuBeds, int generalBeds) {
		Hospital hospital = hospitalRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Capacity rewrite rejected: Hospital not found with ID: " + id));

		hospital.setIcuBeds(icuBeds);
		hospital.setGeneralBeds(generalBeds);

		return modelMapper.map(hospitalRepository.save(hospital), HospitalResponseDTO.class);
	}

	@Override
	@Transactional
	public HospitalResponseDTO updateEmergencyAvailability(Long id, boolean isAvailable) {
		Hospital hospital = hospitalRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Triage redirect failed: Hospital not found with ID: " + id));

		hospital.setEmergencyAvailable(isAvailable);

		return modelMapper.map(hospitalRepository.save(hospital), HospitalResponseDTO.class);
	}
}