package com.ambulance.SmartAmbulanceTracking.DTO;

import jakarta.validation.constraints.*;

public class TrackingDTO {

	@NotNull
	private Long ambulanceId;

	@NotNull
	private double latitude;

	@NotNull
	private double longitude;

	private double speed;

	public Long getAmbulanceId() {
		return ambulanceId;
	}

	public void setAmbulanceId(Long ambulanceId) {
		this.ambulanceId = ambulanceId;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getSpeed() {
		return speed;
	}

	public void setSpeed(double speed) {
		this.speed = speed;
	}

	 
}