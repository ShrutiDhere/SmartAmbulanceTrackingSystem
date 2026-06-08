package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.UserRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.UserResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.Role;
import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;

import com.ambulance.SmartAmbulanceTracking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final ModelMapper modelMapper;

	@Override
	@Transactional
	public UserResponseDTO registerUser(UserRequestDTO requestDTO) {
		// Business Rule Guard: Prevent duplicate email profiles
		if (userRepository.existsByEmail(requestDTO.getEmail())) {
			throw new IllegalStateException(
					"Registration Rejected: Account email already exists inside the database registry.");
		}

		User user = new User();
		user.setName(requestDTO.getName());
		user.setEmail(requestDTO.getEmail());
		user.setPassword(requestDTO.getPassword()); // Note: In a production security setting, encrypt this via BCrypt

		// If no explicit role is passed, default security clearance to PATIENT
		if (requestDTO.getRole() == null) {
			user.setRole(Role.PATIENT);
		} else {
			user.setRole(requestDTO.getRole());
		}

		User savedUser = userRepository.save(user);
		return modelMapper.map(savedUser, UserResponseDTO.class);
	}

	@Override
	public UserResponseDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User profile registry entry missing with ID: " + id));
		return modelMapper.map(user, UserResponseDTO.class);
	}

	@Override
	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream().map(user -> modelMapper.map(user, UserResponseDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public UserResponseDTO updateUserRole(Long id, String roleStr) {
		User user = userRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("Authorization overwrite failed: User not found with ID: " + id));

		try {
			Role updatedRole = Role.valueOf(roleStr.toUpperCase());
			user.setRole(updatedRole);
		} catch (IllegalArgumentException e) {
			throw new IllegalStateException("Security System Error: Invalid authorization assignment value provided.");
		}

		return modelMapper.map(userRepository.save(user), UserResponseDTO.class);
	}

	@Override
	@Transactional
	public void deleteUser(Long id) {
		// Validation Guard: Ensure user exists before trying to delete
		if (!userRepository.existsById(id)) {
			throw new ResourceNotFoundException("Deletion Aborted: User profile account not found with ID: " + id);
		}
		userRepository.deleteById(id);
	}

	@Override
	public UserResponseDTO login(String email, String password) {
		// 1. Fetch user by email or throw exception
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Authentication Failed: Invalid email or password."));

		// 2. Verify password (If using encryption like BCrypt, use
		// passwordEncoder.matches)
		if (!user.getPassword().equals(password)) {
			throw new IllegalStateException("Authentication Failed: Invalid email or password.");
		}

		// 3. Map to DTO and return
		return modelMapper.map(user, UserResponseDTO.class);
	}
}