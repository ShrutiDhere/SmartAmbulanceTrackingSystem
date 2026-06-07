package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.TrackingHistory;

@Repository
public interface TrackingRepository extends JpaRepository<TrackingHistory, Long> {

}