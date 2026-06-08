package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class HospitalResponseDTO {
	private Long id;
	private String name;
	private String address;
	private String contactNumber;
	private String email;
	private int icuBeds;
	private int generalBeds;
	private boolean emergencyAvailable;
	private double latitude;
	private double longitude;
}