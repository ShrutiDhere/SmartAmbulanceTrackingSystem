package com.ambulance.SmartAmbulanceTracking.service;


import com.ambulance.SmartAmbulanceTracking.Entity.Notification;
import java.util.List;

public interface NotificationService {

    Notification send(Notification notification);

    List<Notification> getAll();
}