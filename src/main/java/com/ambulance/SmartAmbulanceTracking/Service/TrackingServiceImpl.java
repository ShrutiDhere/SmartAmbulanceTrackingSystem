package com.ambulance.SmartAmbulanceTracking.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
import com.ambulance.SmartAmbulanceTracking.Entity.TrackingHistory;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
import com.ambulance.SmartAmbulanceTracking.repository.TrackingRepository;

@Service
public class TrackingServiceImpl implements TrackingService {

	@Autowired
	private TrackingRepository repo;

	@Autowired
	private AmbulanceRepository ambulanceRepo;

	public void updateLocation(Long id, double lat, double lng, double speed) {

		Ambulance amb = ambulanceRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

		TrackingHistory t = new TrackingHistory();
		t.setAmbulance(amb);
		t.setLatitude(lat);
		t.setLongitude(lng);
		t.setSpeed(speed);
		t.setTimestamp(LocalDateTime.now());

		repo.save(t);
	}
}