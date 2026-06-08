package com.ambulance.SmartAmbulanceTracking.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Name required")
	private String name;

	@Email(message = "Invalid email")
	@Column(unique = true)
	private String email;

	@Size(min = 6, message = "Password minimum 6 characters")
	private String password;

	@Enumerated(EnumType.STRING)
	private Role role;

	 
}