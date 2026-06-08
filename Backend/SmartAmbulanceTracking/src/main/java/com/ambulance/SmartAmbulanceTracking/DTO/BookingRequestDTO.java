package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long emergencyRequestId;
    private Long patientId;
}