package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.PaymentRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.PaymentResponseDTO;
import java.util.List;

public interface PaymentService {
    PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO);
    PaymentResponseDTO getPaymentById(Long id);
    List<PaymentResponseDTO> getAllPayments();
}