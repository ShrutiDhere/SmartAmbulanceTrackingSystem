package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.NotificationType;

import lombok.Data;

@Data
public class NotificationRequestDTO {
	private String message;
	private NotificationType type; // Maps to your NotificationType enum
	private Long userId;

	public Long getUserId() {
		// TODO Auto-generated method stub
		return userId;
	}
}