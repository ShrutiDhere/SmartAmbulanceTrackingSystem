package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {
}