package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class PatientResponseDTO {
	private Long id;
	private String name;
	private int age;
	private String conditionType;
	private String emergencyLevel;
	private String vitals;
}