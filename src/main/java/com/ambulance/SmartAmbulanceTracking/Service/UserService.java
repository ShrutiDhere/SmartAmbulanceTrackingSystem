package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.User;

public interface UserService {

	User register(User user);

	User login(String email, String password);

	List<User> getAll();

	User getById(Long id);

	void delete(Long id);

	User save(User user);
}