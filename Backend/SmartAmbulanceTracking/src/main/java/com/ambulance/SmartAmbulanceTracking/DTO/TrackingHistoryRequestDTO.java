package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class TrackingHistoryRequestDTO {
    private Long ambulanceId; 
    private double latitude;
    private double longitude;
    private double speed;
}