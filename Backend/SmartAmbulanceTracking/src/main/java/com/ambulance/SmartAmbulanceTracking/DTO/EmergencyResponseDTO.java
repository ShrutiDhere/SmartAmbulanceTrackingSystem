package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.EmergencyStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EmergencyResponseDTO {
    private Long id;
    private double pickupLat;
    private double pickupLng;
    private EmergencyStatus status;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
}