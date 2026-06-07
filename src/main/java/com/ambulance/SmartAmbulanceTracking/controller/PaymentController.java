package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Payment;
import com.ambulance.SmartAmbulanceTracking.Service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService service;

    // 💳 Make payment
    @PostMapping("/pay")
    public ApiResponse<Payment> pay(@RequestBody Payment payment) {
        return new ApiResponse<>(true, "Payment successful",
                service.processPayment(payment));
    }

    // 📄 Get payment by ID
    @GetMapping("/{id}")
    public ApiResponse<Payment> getById(@PathVariable Long id) {
        return new ApiResponse<>(true, "Payment found",
                service.getById(id));
    }

    // 📜 Get all payments
    @GetMapping("/all")
    public ApiResponse<List<Payment>> getAll() {
        return new ApiResponse<>(true, "All payments",
                service.getAll());
    }
}