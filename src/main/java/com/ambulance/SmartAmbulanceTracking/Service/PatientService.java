package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.Patient;

public interface PatientService {
	List<Patient> getAll();

	Patient save(Patient patient);
}