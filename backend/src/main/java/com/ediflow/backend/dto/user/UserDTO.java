package com.ediflow.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;

    private String username;

    private String email;

    public UserDTO(String username, String email, String string) {
    }

//    private String role;

}
