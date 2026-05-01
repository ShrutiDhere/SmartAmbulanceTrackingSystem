package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;

public interface HospitalService {
	List<Hospital> getAll();

	List<Hospital> getAvailable();
}