package com.ambulance.SmartAmbulanceTracking.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ambulance.SmartAmbulanceTracking.Entity.User;
import com.ambulance.SmartAmbulanceTracking.exception.ResourceNotFoundException;
import com.ambulance.SmartAmbulanceTracking.repository.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository repo;

	public List<User> getAll() {
		return repo.findAll();
	}

	public User save(User user) {
		return repo.save(user);
	}

	public User getById(Long id) {
		return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	public void delete(Long id) {
		User user = getById(id);
		repo.delete(user);
	}
}