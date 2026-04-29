package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;

@Entity
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;
    private String type; // ICU, Normal
    private String status; // AVAILABLE, BUSY

    private double latitude;
    private double longitude;

    // Getters and Setters
}