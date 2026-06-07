package com.ambulance.SmartAmbulanceTracking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;
import com.ambulance.SmartAmbulanceTracking.repository.HospitalRepository;

@Service
public class HospitalServiceImpl implements HospitalService {

	@Autowired
	private HospitalRepository repo;

	public List<Hospital> getAll() {
		return repo.findAll();
	}

	public List<Hospital> getAvailable() {
		return repo.findByEmergencyAvailableTrue();
	}
}