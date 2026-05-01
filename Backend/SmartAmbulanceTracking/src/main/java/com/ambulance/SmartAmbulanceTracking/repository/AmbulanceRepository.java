package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;

import java.util.List;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {

    // Used in service (better than filtering in Java)
    List<Ambulance> findByStatus(AmbulanceStatus status);

}