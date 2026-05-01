package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Patient;
import com.ambulance.SmartAmbulanceTracking.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository repo;

    public List<Patient> getAll() {
        return repo.findAll();
    }

    public Patient save(Patient p) {
        return repo.save(p);
    }
}