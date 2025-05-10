package com.ediflow.backend.dto.user;

import com.ediflow.backend.entity.Enums;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Enums.Role role;

    // Constructor para findAll
    public UserDTO(Long id, String username, String email, Enums.Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Constructor para createAdmin
    public UserDTO(String username, String email, String role) {
        this.username = username;
        this.email = email;
        this.role = role != null ? Enums.Role.valueOf(role) : null;
    }

    // Constructor adicional (opcional, si lo necesitas)
    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
