package com.ambulance.SmartAmbulanceTracking.DTO;

import java.math.BigDecimal;

import com.ambulance.SmartAmbulanceTracking.Entity.PaymentMethod;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long bookingId;
    private  BigDecimal amount;
    private PaymentMethod  paymentMethod;
    private String transactionId;
}