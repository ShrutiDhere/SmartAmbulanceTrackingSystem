package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private double amount;

	private String status; // SUCCESS / FAILED / PENDING

	private String paymentMethod; // UPI / CARD / CASH

	private LocalDateTime paymentTime;

	// 🔗 Relation with Booking (EmergencyRequest)
	@OneToOne
	@JoinColumn(name = "booking_id")
	private EmergencyRequest booking;

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public LocalDateTime getPaymentTime() {
		return paymentTime;
	}

	public void setPaymentTime(LocalDateTime paymentTime) {
		this.paymentTime = paymentTime;
	}

	public EmergencyRequest getBooking() {
		return booking;
	}

	public void setBooking(EmergencyRequest booking) {
		this.booking = booking;
	}

	 
}
