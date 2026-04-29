package com.ambulance.SmartAmbulanceTracking.Entity;


import jakarta.persistence.*;

@Entity
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String licenseNumber;

    // Getters and Setters
}