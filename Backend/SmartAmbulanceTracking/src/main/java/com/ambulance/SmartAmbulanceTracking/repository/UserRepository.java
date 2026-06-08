package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	// Check if an email is already registered to enforce unique users
	boolean existsByEmail(String email);

	// Used later for authentication mechanisms
	Optional<User> findByEmail(String email);
}