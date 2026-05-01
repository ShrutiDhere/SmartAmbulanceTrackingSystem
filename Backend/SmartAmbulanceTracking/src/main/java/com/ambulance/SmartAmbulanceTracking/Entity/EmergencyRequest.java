package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EmergencyRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private double pickupLat;
	private double pickupLng;

	private String status;

	private LocalDateTime createdAt;

	@ManyToOne
	private Ambulance ambulance;

	@ManyToOne
	private Hospital hospital;
	@ManyToOne
	private User user;
	@OneToOne(mappedBy = "booking")
	private Payment payment;

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Ambulance getAmbulance() {
		return ambulance;
	}

	public void setAmbulance(Ambulance ambulance) {
		this.ambulance = ambulance;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
}