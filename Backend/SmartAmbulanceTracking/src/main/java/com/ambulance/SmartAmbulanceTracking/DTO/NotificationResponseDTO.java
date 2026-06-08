package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
	private Long id;
	private String message;
	private String type;
	private boolean readStatus;
	private LocalDateTime timestamp;
	private Long userId;
	private String userName;
}