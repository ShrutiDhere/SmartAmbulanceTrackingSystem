package com.ambulance.SmartAmbulanceTracking.service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;

public interface HospitalService {
	List<Hospital> getAll();

	List<Hospital> getAvailable();
}