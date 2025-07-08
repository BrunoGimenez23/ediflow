package com.ediflow.backend.dto.resident;

import lombok.Data;

@Data
public class RegisterOrReplaceResidentRequest {
    private Long apartmentId;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private Long ci;

}

