package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
	private Long id;
	private BookingStatus status;
	private Long emergencyRequestId;
	private String patientName;
	private String vehicleNumber;
	private String driverName;
	private String driverPhone;
}