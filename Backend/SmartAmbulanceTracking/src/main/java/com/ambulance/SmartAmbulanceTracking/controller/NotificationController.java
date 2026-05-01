package com.ambulance.SmartAmbulanceTracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ambulance.SmartAmbulanceTracking.ApiResponce.ApiResponse;
import com.ambulance.SmartAmbulanceTracking.Entity.Notification;
import com.ambulance.SmartAmbulanceTracking.Service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin
public class NotificationController {

	@Autowired
	private NotificationService service;

	// 🔔 Send notification
	@PostMapping("/send")
	public ApiResponse<Notification> send(@RequestBody Notification notification) {
		return new ApiResponse<>(true, "Notification sent", service.send(notification));
	}

	// 📄 Get all notifications
	@GetMapping("/all")
	public ApiResponse<List<Notification>> getAll() {
		return new ApiResponse<>(true, "All notifications", service.getAll());
	}
}
