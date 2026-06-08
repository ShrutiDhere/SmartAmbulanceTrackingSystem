package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
	// Custom finder to pull unread alerts for a specific user dashboard
	List<Notification> findByUserIdAndReadStatusFalse(Long userId);
}