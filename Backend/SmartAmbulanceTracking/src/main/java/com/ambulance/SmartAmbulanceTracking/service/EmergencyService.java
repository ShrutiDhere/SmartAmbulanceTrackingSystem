package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;

public interface EmergencyService {
    EmergencyRequest create(EmergencyRequest request);
}