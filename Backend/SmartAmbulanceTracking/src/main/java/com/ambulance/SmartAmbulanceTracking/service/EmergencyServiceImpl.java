package com.ambulance.SmartAmbulanceTracking.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;
import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;
import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
import com.ambulance.SmartAmbulanceTracking.repository.EmergencyRequestRepository;
import com.ambulance.SmartAmbulanceTracking.repository.HospitalRepository;

@Service
public class EmergencyServiceImpl implements EmergencyService {

	@Autowired
	private EmergencyRequestRepository requestRepo;

	@Autowired
	private AmbulanceRepository ambulanceRepo;

	@Autowired
	private HospitalRepository hospitalRepo;

	public EmergencyRequest create(EmergencyRequest request) {

		Ambulance ambulance = ambulanceRepo.findByStatus(AmbulanceStatus.AVAILABLE).stream().findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("No ambulance available"));

		Hospital hospital = hospitalRepo.findByEmergencyAvailableTrue().stream().findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("No hospital available"));

		ambulance.setStatus(AmbulanceStatus.BUSY);

		request.setAmbulance(ambulance);
		request.setHospital(hospital);
		request.setStatus("ASSIGNED");
		request.setCreatedAt(LocalDateTime.now());

		ambulanceRepo.save(ambulance);

		return requestRepo.save(request);
	}
}