package com.ambulance.SmartAmbulanceTracking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;

@Repository
public interface AmbulanceRepository
        extends JpaRepository<Ambulance, Long> {

    List<Ambulance> findByStatus(AmbulanceStatus status);

}