package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;

import jakarta.validation.constraints.*;

public class EmergencyRequestDTO {

	@NotNull
	private Long patientId;

	@NotNull
	private double pickupLat;

	@NotNull
	private double pickupLng;

	// getters & setters

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public double getPickupLat() {
		return pickupLat;
	}

	public void setPickupLat(double pickupLat) {
		this.pickupLat = pickupLat;
	}

	public double getPickupLng() {
		return pickupLng;
	}

	public void setPickupLng(double pickupLng) {
		this.pickupLng = pickupLng;
	}

	public void setAmbulance(Ambulance ambulance) {
		// TODO Auto-generated method stub
		
	}
}