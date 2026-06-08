package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.Role;
import lombok.Data;

@Data
public class UserResponseDTO {
	private Long id;
	private String name;
	private String email;
	private Role role;
}