package com.ambulance.SmartAmbulanceTracking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.*;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private EmergencyRequestRepository requestRepo;

    @Autowired
    private AmbulanceRepository ambulanceRepo;

    @Autowired
    private HospitalRepository hospitalRepo;

    @Override
    public EmergencyRequest createBooking(EmergencyRequest request) {

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
        request.setStatus(EmergencyStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        ambulanceRepo.save(ambulance);

        return requestRepo.save(request);
    }

    @Override
    public EmergencyRequest getById(Long id) {
        return requestRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));
    }

    @Override
    public List<EmergencyRequest> getAll() {
        return requestRepo.findAll();
    }

    @Override
    public EmergencyRequest cancelBooking(Long id) {

        EmergencyRequest req = getById(id);

        req.setStatus(EmergencyStatus.CANCELLED);

        Ambulance amb = req.getAmbulance();

        if (amb != null) {
            amb.setStatus(AmbulanceStatus.AVAILABLE);
            ambulanceRepo.save(amb);
        }

        return requestRepo.save(req);
    }

    @Override
    public EmergencyRequest updateStatus(Long id, String status) {

        EmergencyRequest req = getById(id);

        EmergencyStatus newStatus =
                EmergencyStatus.valueOf(status.toUpperCase());

        req.setStatus(newStatus);

        if (newStatus == EmergencyStatus.COMPLETED
                || newStatus == EmergencyStatus.CANCELLED) {

            Ambulance amb = req.getAmbulance();

            if (amb != null) {
                amb.setStatus(AmbulanceStatus.AVAILABLE);
                ambulanceRepo.save(amb);
            }
        }

        return requestRepo.save(req);
    }
}