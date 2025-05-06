package com.ediflow.backend.dto.admin;

import com.ediflow.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdminDTO {
    private Long id;

    private UserDTO userDTO;

}
