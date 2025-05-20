package com.ediflow.backend.dto.resident;

import com.ediflow.backend.dto.user.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResidentSummaryDTO {
    private Long id;
    private Long ci;
    private UserSummaryDTO userDTO;
    private int apartmentNumber;
}