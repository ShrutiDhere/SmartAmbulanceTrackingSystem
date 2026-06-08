package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class DriverRequestDTO {
    private String name;
    private String phoneNumber;
    private String email;
    private String licenseNumber;
}