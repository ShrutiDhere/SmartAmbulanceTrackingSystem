package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class AmbulanceRequestDTO {
    private String vehicleNumber;
    private Long driverId;
    private double latitude;
    private double longitude;
}