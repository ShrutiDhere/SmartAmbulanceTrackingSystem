package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.Driver;

public interface DriverService {
	List<Driver> getAll();

	Driver updateAvailability(Long id, boolean status);
}