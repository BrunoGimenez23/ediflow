package com.ediflow.backend.dto.user;

import com.ediflow.backend.enums.Role;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String fullName;
    private Long adminId;
    private String plan;
}
