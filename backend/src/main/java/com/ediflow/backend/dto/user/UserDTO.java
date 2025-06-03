package com.ediflow.backend.dto.user;

import com.ediflow.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private Role role;

    // Constructor para findAll
    public UserDTO(Long id, String username, String email, Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Constructor para createAdmin
    public UserDTO(String username, String email, String role) {
        this.username = username;
        this.email = email;
        this.role = role != null ? Role.valueOf(role) : null;
    }

    // Constructor adicional (opcional, si lo necesitas)
    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public UserDTO(String username) {
    }
}
