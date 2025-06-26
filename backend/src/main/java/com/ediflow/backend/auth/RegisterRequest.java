package com.ediflow.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private Long ci;
    private String email;
    private String password;
    private Long apartmentId;
    private String inviteCode;
    private String fullName;
}
