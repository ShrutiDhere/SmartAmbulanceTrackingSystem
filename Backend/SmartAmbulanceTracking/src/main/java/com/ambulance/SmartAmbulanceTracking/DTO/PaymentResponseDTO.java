package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.PaymentMethod;
import com.ambulance.SmartAmbulanceTracking.Entity.PaymentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
	private Long id;
	private Long bookingId;
	private double amount;
	private PaymentStatus status;
	private PaymentMethod paymentMethod;
	private String transactionId;
	private LocalDateTime paymentTime;
}