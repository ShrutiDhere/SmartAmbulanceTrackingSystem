package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 🔔 Get notifications for specific user
    List<Notification> findByUserId(Long userId);
}