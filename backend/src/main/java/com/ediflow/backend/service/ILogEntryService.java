package com.ediflow.backend.service;

import com.ediflow.backend.dto.logEntry.CreateLogEntryRequestDTO;
import com.ediflow.backend.dto.logEntry.LogEntryDTO;
import com.ediflow.backend.enums.EntryType;

import java.util.List;

public interface ILogEntryService {
    LogEntryDTO create(CreateLogEntryRequestDTO req);
    List<LogEntryDTO> findByResident(Long residentId);
    List<LogEntryDTO> findByBuilding(Long buildingId);
    List<LogEntryDTO> findByBuildingAndType(Long buildingId, EntryType type);
}
