package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.NotificationRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.NotificationResponseDTO;
import java.util.List;

public interface NotificationService {
	NotificationResponseDTO sendNotification(NotificationRequestDTO requestDTO);

	NotificationResponseDTO getNotificationById(Long id);

	List<NotificationResponseDTO> getUnreadNotificationsByUserId(Long userId);

	NotificationResponseDTO markAsRead(Long id);
}