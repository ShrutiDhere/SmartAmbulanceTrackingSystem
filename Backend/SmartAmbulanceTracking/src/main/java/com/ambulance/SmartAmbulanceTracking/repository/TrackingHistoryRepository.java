package com.ambulance.SmartAmbulanceTracking.repository;

import com.ambulance.SmartAmbulanceTracking.Entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {
    // Custom query updated to look up records sequentially by ambulanceId
    List<TrackingHistory> findByAmbulanceIdOrderByTimestampAsc(Long ambulanceId);
}