package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	private PaymentStatus status;

	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;

	private String transactionId;

	private LocalDateTime paymentTime;

	@OneToOne
	@JoinColumn(name = "booking_id")
	private Booking booking;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal d) {
		this.amount = d;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setPaymentStatus(PaymentStatus status) {
		this.status = status;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public LocalDateTime getPaymentTime() {
		return paymentTime;
	}

	public void setPaymentTime(LocalDateTime paymentTime) {
		this.paymentTime = paymentTime;
	}

	public Booking getBooking() {
		return booking;
	}

	public void setBooking(Booking booking) {
		this.booking = booking;
	}
}