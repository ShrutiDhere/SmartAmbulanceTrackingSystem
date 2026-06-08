package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.NotificationRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.NotificationResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Notification;
import com.ambulance.SmartAmbulanceTracking.Entity.NotificationType;
import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.NotificationRepository;
import com.ambulance.SmartAmbulanceTracking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;

	private final UserRepository userRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public NotificationResponseDTO sendNotification(NotificationRequestDTO requestDTO) {
		User user = userRepository.findById(requestDTO.getUserId()).orElseThrow(() -> new ResourceNotFoundException(
				"Alert Rejected: Target User not found with ID: " + requestDTO.getUserId()));

		Notification notification = new Notification();
		notification.setMessage(requestDTO.getMessage());
		notification.setUser(user);

		// Safely parse the incoming string type into your defined entity Enum
		try {
			notification.setType(requestDTO.getType());
		} catch (IllegalArgumentException e) {
			throw new IllegalStateException("Invalid alert classification type provided.");
		}

		// Default metadata configuration flags
		notification.setReadStatus(false);
		notification.setTimestamp(LocalDateTime.now());

		Notification savedNotification = notificationRepository.save(notification);
		return convertToResponseDTO(savedNotification);
	}

	@Override
	public NotificationResponseDTO getNotificationById(Long id) {
		Notification notification = notificationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Notification record missing with ID: " + id));
		return convertToResponseDTO(notification);
	}

	@Override
	public List<NotificationResponseDTO> getUnreadNotificationsByUserId(Long userId) {
		// Double check user validation check before query run
		if (!userRepository.existsById(userId)) {
			throw new ResourceNotFoundException("User registry missing with ID: " + userId);
		}
		return notificationRepository.findByUserIdAndReadStatusFalse(userId).stream().map(this::convertToResponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public NotificationResponseDTO markAsRead(Long id) {
		Notification notification = notificationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
				"Acknowledge update failed: Notification not found with ID: " + id));

		notification.setReadStatus(true);
		return convertToResponseDTO(notificationRepository.save(notification));
	}

	private NotificationResponseDTO convertToResponseDTO(Notification notification) {
		NotificationResponseDTO dto = modelMapper.map(notification, NotificationResponseDTO.class);
		if (notification.getUser() != null) {
			dto.setUserId(notification.getUser().getId());
			dto.setUserName(notification.getUser().getName());
		}
		return dto;
	}
}