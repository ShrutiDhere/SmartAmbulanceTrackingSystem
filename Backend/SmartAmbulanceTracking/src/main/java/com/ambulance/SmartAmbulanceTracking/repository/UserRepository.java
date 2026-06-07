package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ambulance.SmartAmbulanceTracking.Entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}