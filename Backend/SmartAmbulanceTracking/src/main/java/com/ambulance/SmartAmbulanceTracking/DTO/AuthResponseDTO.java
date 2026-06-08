package com.ambulance.SmartAmbulanceTracking.DTO;

import com.ambulance.SmartAmbulanceTracking.Entity.Role;
import lombok.Data;

@Data
public class AuthResponseDTO {
	private String token;
	private Long id;
	private String name;
	private String email;
	private Role role;
}