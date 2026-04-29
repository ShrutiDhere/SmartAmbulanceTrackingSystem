package com.ambulance.SmartAmbulanceTracking.Entity;
 
import jakarta.persistence.*;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;

    private String patientCondition;  // ✅ FIXED

    private String pickupLocation;

    // getters and setters
}