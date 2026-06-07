package com.ambulance.SmartAmbulanceTracking.service;

public interface TrackingService {
    void updateLocation(Long ambulanceId, double lat, double lng, double speed);
}
