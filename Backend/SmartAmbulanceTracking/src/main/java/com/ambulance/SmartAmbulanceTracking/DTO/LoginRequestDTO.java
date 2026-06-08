package com.ambulance.SmartAmbulanceTracking.DTO;

import lombok.Data;

@Data
public class LoginRequestDTO {
	private String email;
	private String password;
}