package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.BookingRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.BookingResponseDTO;
import com.ambulance.SmartAmbulanceTracking.Entity.BookingStatus;
import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO requestDTO);
    BookingResponseDTO getBookingById(Long id);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus status);
}