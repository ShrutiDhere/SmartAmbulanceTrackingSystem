package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Booking;
import com.ambulance.SmartAmbulanceTracking.Entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Finds all bookings assigned to a specific driver that are pending action
    List<Booking> findByDriverIdAndStatus(Long driverId, BookingStatus status);
    
    // Alternative: Find any booking currently assigned to a driver that is actively running
    List<Booking> findByDriverIdAndStatusIn(Long driverId, List<BookingStatus> statuses);
}