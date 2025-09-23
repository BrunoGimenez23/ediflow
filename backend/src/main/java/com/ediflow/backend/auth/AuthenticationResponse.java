package com.ediflow.backend.auth;

import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UserDTO user;
    private Role role;
    private String email;
    private String username;
}
