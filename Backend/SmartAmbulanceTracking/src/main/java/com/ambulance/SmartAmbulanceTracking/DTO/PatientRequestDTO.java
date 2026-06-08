package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class PatientRequestDTO {
	private String name;
	private int age;
	private String conditionType;
	private String emergencyLevel;
	private String vitals;
}