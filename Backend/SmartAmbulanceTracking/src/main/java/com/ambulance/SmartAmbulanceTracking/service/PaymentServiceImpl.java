package com.ambulance.SmartAmbulanceTracking.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Payment;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.PaymentRepository;
 

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository repo;

    @Override
    public Payment processPayment(Payment payment) {

        payment.setStatus("SUCCESS");
        payment.setPaymentTime(LocalDateTime.now());

        return repo.save(payment);
    }

    @Override
    public Payment getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    @Override
    public List<Payment> getAll() {
        return repo.findAll();
    }
}