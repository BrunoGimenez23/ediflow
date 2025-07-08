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
    private String fullName;
    private Long adminId;
    private Integer trialDaysLeft;
    private String plan;

}
