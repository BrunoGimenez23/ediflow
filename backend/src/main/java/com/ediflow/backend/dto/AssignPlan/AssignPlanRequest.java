package com.ediflow.backend.dto.AssignPlan;

import lombok.Data;

@Data
public class AssignPlanRequest {
    private String email;
    private String planName;
    private String duration;
    private Integer unitsPaid;

    public AssignPlanRequest() {}

}
