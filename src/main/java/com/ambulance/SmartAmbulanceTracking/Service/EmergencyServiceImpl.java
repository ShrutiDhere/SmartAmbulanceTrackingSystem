package com.ambulance.SmartAmbulanceTracking.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.*;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.*;

@Service
public class EmergencyServiceImpl implements EmergencyService {

    @Autowired
    private EmergencyRequestRepository requestRepo;

    @Autowired
    private AmbulanceRepository ambulanceRepo;

    @Autowired
    private HospitalRepository hospitalRepo;

    @Override
    public EmergencyRequest create(EmergencyRequest request) {

        Ambulance ambulance = ambulanceRepo.findByStatus(AmbulanceStatus.AVAILABLE)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("No ambulance available"));

        Hospital hospital = hospitalRepo.findByEmergencyAvailableTrue()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("No hospital available"));

        ambulance.setStatus(AmbulanceStatus.BUSY);

        request.setAmbulance(ambulance);
        request.setHospital(hospital);

        // Initial workflow state
        request.setStatus(EmergencyStatus.PENDING);

        request.setCreatedAt(LocalDateTime.now());

        ambulanceRepo.save(ambulance);

        return requestRepo.save(request);
    }
}