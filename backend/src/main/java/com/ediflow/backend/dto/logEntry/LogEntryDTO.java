package com.ediflow.backend.dto.logEntry;

import com.ediflow.backend.enums.EntryType;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class LogEntryDTO {
    private Long id;
    private EntryType type;
    private String description;
    private LocalDateTime createdAt;
    private String residentName;
    private String createdByName;

}