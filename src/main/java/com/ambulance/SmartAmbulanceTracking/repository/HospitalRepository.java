package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

	// Used in service
	List<Hospital> findByEmergencyAvailableTrue();

}