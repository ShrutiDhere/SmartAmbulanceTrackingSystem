package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String message;

	@Enumerated(EnumType.STRING)
	private NotificationType type;

	private boolean readStatus;

	private LocalDateTime createdAt;

	// Optional relation to user
	@ManyToOne
	private User user;

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public NotificationType getType() {
		return type;
	}

	public void setType(NotificationType type) {
		this.type = type;
	}

	public boolean isReadStatus() {
		return readStatus;
	}

	public void setReadStatus(boolean readStatus) {
		this.readStatus = readStatus;
	}

	public LocalDateTime getTimestamp() {
		return  createdAt;
	}

	public void setTimestamp(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}