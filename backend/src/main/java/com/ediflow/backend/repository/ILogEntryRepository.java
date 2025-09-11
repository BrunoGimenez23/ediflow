package com.ediflow.backend.repository;

import com.ediflow.backend.entity.LogEntry;
import com.ediflow.backend.enums.EntryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ILogEntryRepository extends JpaRepository<LogEntry, Long> {
    @Query("SELECT l FROM LogEntry l WHERE l.resident.id = :residentId ORDER BY l.createdAt DESC")
    List<LogEntry> findByResidentIdOrderByCreatedAtDesc(@Param("residentId") Long residentId);

    @Query("SELECT l FROM LogEntry l WHERE l.building.id = :buildingId ORDER BY l.createdAt DESC")
    List<LogEntry> findByBuildingIdOrderByCreatedAtDesc(@Param("buildingId") Long buildingId);

    List<LogEntry> findByBuildingIdAndTypeOrderByCreatedAtDesc(Long buildingId, EntryType type);
}
