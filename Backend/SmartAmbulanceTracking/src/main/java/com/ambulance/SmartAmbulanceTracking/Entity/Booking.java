package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status; // REQUESTED, ACCEPTED, COMPLETED

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Ambulance ambulance;

    @ManyToOne
    private Driver driver;

    // Getters and Setters
}