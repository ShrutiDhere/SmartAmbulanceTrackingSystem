package com.ambulance.SmartAmbulanceTracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ambulance.SmartAmbulanceTracking.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}