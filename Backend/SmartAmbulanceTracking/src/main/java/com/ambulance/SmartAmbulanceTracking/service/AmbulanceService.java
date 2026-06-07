package com.ambulance.SmartAmbulanceTracking.service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;

public interface AmbulanceService {
    List<Ambulance> getAll();
    Ambulance updateStatus(Long id, String status);
    List<Ambulance> findNearby(double lat, double lng);
}