package com.ambulance.SmartAmbulanceTracking.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyRequest;
import java.util.List;

public interface BookingService {

    EmergencyRequest createBooking(EmergencyRequest request);

    EmergencyRequest getById(Long id);

    List<EmergencyRequest> getAll();

    EmergencyRequest cancelBooking(Long id);

    EmergencyRequest updateStatus(Long id, String status);
}