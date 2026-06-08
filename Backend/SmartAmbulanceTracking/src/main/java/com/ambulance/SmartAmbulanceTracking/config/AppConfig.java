package com.ambulance.SmartAmbulanceTracking.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        // Configure custom mappings to safely extract names/ids from complex nested entities
        mapper.typeMap(com.ambulance.SmartAmbulanceTracking.Entity.Booking.class, com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO.class)
            .addMappings(m -> {
                m.map(src -> src.getEmergencyRequest().getId(), com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO::setEmergencyRequestId);
                m.map(src -> src.getPatient().getName(), com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO::setPatientName);
                m.map(src -> src.getAmbulance().getVehicleNumber(), com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO::setVehicleNumber);
                m.map(src -> src.getDriver().getName(), com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO::setDriverName);
                m.map(src -> src.getDriver().getPhoneNumber(), com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO::setDriverPhone);
            });
        return mapper;
    }
}