package com.ambulance.SmartAmbulanceTracking.service;

import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryRequestDTO;
import com.ambulance.SmartAmbulanceTracking.DTO.TrackingHistoryResponseDTO;
import java.util.List;

public interface TrackingHistoryService {
    TrackingHistoryResponseDTO logLocation(TrackingHistoryRequestDTO requestDTO);
    List<TrackingHistoryResponseDTO> getRouteHistoryByAmbulanceId(Long ambulanceId);
}