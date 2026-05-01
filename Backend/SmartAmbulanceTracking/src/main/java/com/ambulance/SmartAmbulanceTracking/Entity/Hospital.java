package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;

@Entity
public class Hospital {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String address;

	private int icuBeds;
	private int generalBeds;

	private boolean emergencyAvailable;

	private double latitude;
	private double longitude;

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public int getIcuBeds() {
		return icuBeds;
	}

	public void setIcuBeds(int icuBeds) {
		this.icuBeds = icuBeds;
	}

	public int getGeneralBeds() {
		return generalBeds;
	}

	public void setGeneralBeds(int generalBeds) {
		this.generalBeds = generalBeds;
	}

	public boolean isEmergencyAvailable() {
		return emergencyAvailable;
	}

	public void setEmergencyAvailable(boolean emergencyAvailable) {
		this.emergencyAvailable = emergencyAvailable;
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
}