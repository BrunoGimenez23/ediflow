package com.ediflow.backend.dto.logEntry;

import com.ediflow.backend.enums.EntryType;
import lombok.Data;

@Data
public class CreateLogEntryRequestDTO {
    private Long residentId;
    private EntryType type;
    private String description;

}

