package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Driver;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.DriverRepository;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository repo;

    @Override
    public List<Driver> getAll() {
        return repo.findAll();
    }

    @Override
    public Driver updateAvailability(Long id, boolean status) {

        Driver driver = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Driver not found"));

        driver.setAvailable(status);

        return repo.save(driver);
    }
}