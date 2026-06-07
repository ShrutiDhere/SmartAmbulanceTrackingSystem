//package com.ambulance.SmartAmbulanceTracking.service;

//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.ambulance.SmartAmbulanceTracking.Entity.Ambulance;
//import com.ambulance.SmartAmbulanceTracking.Entity.AmbulanceStatus;
//import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
//
//import java.util.Comparator;
//import java.util.List;
//
//@Service
//public class AmbulanceService {
//
//    @Autowired
//    private AmbulanceRepository repo;
//
//    public List<Ambulance> getAll() {
//        return repo.findAll();
//    }
//
//    public Ambulance updateStatus(Long id, String status) {
//        Ambulance amb = repo.findById(id).orElseThrow();
//        amb.setStatus(AmbulanceStatus.valueOf(status));
//        return repo.save(amb);
//    }
//
//    public List<Ambulance> findNearby(double lat, double lng) {
//        return repo.findAll().stream()
//                .filter(a -> a.getStatus() == AmbulanceStatus.AVAILABLE)
//                .sorted(Comparator.comparingDouble(a ->
//                        calculateDistance(lat, lng, a.getLatitude(), a.getLongitude())))
//                .limit(5)
//                .toList();
//    }
//
//    // Haversine formula (accurate distance)
//    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
//        double R = 6371; // Earth radius (km)
//        double dLat = Math.toRadians(lat2 - lat1);
//        double dLon = Math.toRadians(lon2 - lon1);
//
//        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                Math.cos(Math.toRadians(lat1)) *
//                        Math.cos(Math.toRadians(lat2)) *
//                        Math.sin(dLon / 2) *
//                        Math.sin(dLon / 2);
//
//        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//        return R * c;
//    }
//}

package com.ambulance.SmartAmbulanceTracking.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.*;
import com.ambulance.SmartAmbulanceTracking.repository.AmbulanceRepository;
import com.ambulance.SmartAmbulanceTracking.Service.AmbulanceServiceImpl;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;

import java.util.Comparator;
import java.util.List;

@Service
public class AmbulanceServiceImpl implements AmbulanceService {

    @Autowired
    private AmbulanceRepository repo;

    public List<Ambulance> getAll() {
        return repo.findAll();
    }

    public Ambulance updateStatus(Long id, String status) {
        Ambulance amb = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        amb.setStatus(AmbulanceStatus.valueOf(status));
        return repo.save(amb);
    }

    public List<Ambulance> findNearby(double lat, double lng) {
        return repo.findAll().stream()
            .filter(a -> a.getStatus() == AmbulanceStatus.AVAILABLE)
            .sorted(Comparator.comparingDouble(a ->
                distance(lat, lng, a.getLatitude(), a.getLongitude())))
            .limit(5)
            .toList();
    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1-lat2,2)+Math.pow(lon1-lon2,2));
    }
}