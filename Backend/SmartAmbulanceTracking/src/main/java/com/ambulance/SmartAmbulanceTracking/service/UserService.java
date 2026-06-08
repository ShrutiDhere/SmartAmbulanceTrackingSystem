package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.UserRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.UserResponseDTO;
import java.util.List;

public interface UserService {
	UserResponseDTO registerUser(UserRequestDTO requestDTO);

	UserResponseDTO getUserById(Long id);

	List<UserResponseDTO> getAllUsers();

	UserResponseDTO updateUserRole(Long id, String roleStr);
	UserResponseDTO login(String email, String password);

	void deleteUser(Long id);
	
}