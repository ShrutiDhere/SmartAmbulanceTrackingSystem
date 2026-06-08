package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TrackingHistoryResponseDTO {
    private Long id;
    private Long ambulanceId;
    private double latitude;
    private double longitude;
    private double speed;
    private LocalDateTime timestamp;
}