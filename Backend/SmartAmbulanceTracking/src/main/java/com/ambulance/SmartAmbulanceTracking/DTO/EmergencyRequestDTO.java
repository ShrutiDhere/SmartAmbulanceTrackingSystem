package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class EmergencyRequestDTO {
	private double pickupLat;
	private double pickupLng;
	private Long userId;
}