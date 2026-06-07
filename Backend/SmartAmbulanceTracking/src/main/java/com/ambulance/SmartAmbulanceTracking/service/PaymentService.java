package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.Entity.Payment;
import java.util.List;

public interface PaymentService {

	Payment processPayment(Payment payment);

	Payment getById(Long id);

	List<Payment> getAll();
}