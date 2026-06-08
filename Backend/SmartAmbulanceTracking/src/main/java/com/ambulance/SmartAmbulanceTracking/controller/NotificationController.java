package com.ambulance.SmartAmbulanceTracking.controller;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.DTO.NotificationRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.NotificationResponseDTO;
import com.ambulance.SmartAmbulanceTracking.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

	private final NotificationService notificationService;

	// SEND A NOTIFICATION
	@PostMapping("/send")
	public ResponseEntity<ApiResponse<NotificationResponseDTO>> sendNotification(
			@RequestBody NotificationRequestDTO requestDTO) {
		NotificationResponseDTO response = notificationService.sendNotification(requestDTO);
		return new ResponseEntity<>(new ApiResponse<>(true, "Notification sent successfully.", response),
				HttpStatus.CREATED);
	}

	// GET ALL UNREAD NOTIFICATIONS FOR A USER
	@GetMapping("/user/{userId}/unread")
	public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getUnreadByUser(@PathVariable Long userId) {
		List<NotificationResponseDTO> response = notificationService.getUnreadNotificationsByUserId(userId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Unread notifications retrieved successfully.", response));
	}

	// MARK AN ALERT AS READ (Acknowledge)
	@PutMapping("/{id}/read")
	public ResponseEntity<ApiResponse<NotificationResponseDTO>> markAsRead(@PathVariable Long id) {
		NotificationResponseDTO response = notificationService.markAsRead(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read.", response));
	}
}