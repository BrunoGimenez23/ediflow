package com.ediflow.backend.dto.marketplace;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {
    private String username;
    private String email;
    private String fullName;
    private String password;

    // Provider-specific
    private String companyName;
    private String contactName;
    private String phone;
    private String address;
    private String category;
    private String location;
}

