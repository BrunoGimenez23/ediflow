package com.ediflow.backend.dto.user;

import com.ediflow.backend.enums.Role;
import jakarta.validation.constraints.Email;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequestDTO {
    @Email
    private String email;
    private String username;
    private String fullName;
    private String password;
    private Role role;
    private Long buildingId;
}