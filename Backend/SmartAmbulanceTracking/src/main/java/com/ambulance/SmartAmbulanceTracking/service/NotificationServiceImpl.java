package com.ambulance.SmartAmbulanceTracking.service;

 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.Notification;
import com.ambulance.SmartAmbulanceTracking.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Override
    public Notification send(Notification notification) {

        notification.setTimestamp(LocalDateTime.now());

        // You can later integrate:
        // Email / SMS / Push Notification here

        return repo.save(notification);
    }

    @Override
    public List<Notification> getAll() {
        return repo.findAll();
    }
}