package com.ambulance.SmartAmbulanceTracking.Service;

import java.util.List;

import com.ambulance.SmartAmbulanceTracking.Entity.User;

public interface UserService {

	List<User> getAll();

	User save(User user);

	User getById(Long id);

	void delete(Long id);
}