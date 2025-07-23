package com.ediflow.backend.dto.admin;

import lombok.Data;

@Data
public class AssignPlanRequestDTO {
    private String email;
    private String plan;
    private String planDuration;
    private Integer unitsPaid;
}
