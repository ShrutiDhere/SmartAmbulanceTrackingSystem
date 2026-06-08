package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AmbulanceResponseDTO {
    private Long id;
    private String vehicleNumber;
    private AmbulanceStatus status;
    private double latitude;
    private double longitude;
    private double speed;
    private String currentLocation;
    private LocalDateTime lastUpdated;
    private Long driverId;
    private String driverName;
    private String driverPhone;
}