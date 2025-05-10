package com.ediflow.backend.dto;



import com.ediflow.backend.dto.admin.AdminDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BuildingDTO {

    private Long id;
    private String name;
    private String address;
    private AdminDTO adminDTO;
    private int residentCount;
}
