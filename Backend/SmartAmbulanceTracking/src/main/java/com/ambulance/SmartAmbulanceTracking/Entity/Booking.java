package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "booking")
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	private BookingStatus status;

	@OneToOne
	@JoinColumn(name = "emergency_request_id")
	private EmergencyRequest emergencyRequest;

	@ManyToOne
	@JoinColumn(name = "patient_id")
	private Patient patient;

	@ManyToOne
	@JoinColumn(name = "ambulance_id")
	private Ambulance ambulance;

	@ManyToOne
	@JoinColumn(name = "driver_id")
	private Driver driver;

	@OneToOne(mappedBy = "booking")
	private Payment payment;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public EmergencyRequest getEmergencyRequest() {
		return emergencyRequest;
	}

	public void setEmergencyRequest(EmergencyRequest emergencyRequest) {
		this.emergencyRequest = emergencyRequest;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Ambulance getAmbulance() {
		return ambulance;
	}

	public void setAmbulance(Ambulance ambulance) {
		this.ambulance = ambulance;
	}

	public Driver getDriver() {
		return driver;
	}

	public void setDriver(Driver driver) {
		this.driver = driver;
	}

	public Payment getPayment() {
		return payment;
	}

	public void setPayment(Payment payment) {
		this.payment = payment;
	}

}