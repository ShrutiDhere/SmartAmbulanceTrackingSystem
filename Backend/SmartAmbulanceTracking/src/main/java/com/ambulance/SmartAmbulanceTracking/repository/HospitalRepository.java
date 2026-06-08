package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
}