package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class DriverResponseDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String licenseNumber;
    private boolean available;
    private Long ambulanceId;
    private String vehicleNumber;
}