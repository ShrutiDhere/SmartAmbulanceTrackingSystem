package com.ambulance.SmartAmbulanceTracking.Service;

public interface TrackingService {
    void updateLocation(Long ambulanceId, double lat, double lng, double speed);
}
