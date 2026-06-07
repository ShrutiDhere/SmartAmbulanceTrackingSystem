package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

}