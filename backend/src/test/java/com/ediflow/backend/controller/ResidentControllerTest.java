package com.ediflow.backend.controller;

import com.ediflow.backend.configuration.JwtService;
import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.service.IResidentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResidentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ResidentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private IResidentService residentService;

    @Autowired
    private ObjectMapper objectMapper;

    private ResidentDTO sampleResidentDTO;

    @BeforeEach
    void setup() {
        // Construir UserDTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(10L);
        userDTO.setUsername("juanperez");
        userDTO.setEmail("juan@example.com");
        // Agrega más campos si los tienes en UserDTO

        // Construir BuildingDTO
        BuildingDTO buildingDTO = new BuildingDTO();
        buildingDTO.setId(1L);
        buildingDTO.setName("Edificio Central");
        buildingDTO.setAddress("Calle Falsa 123");

        // Construir ApartmentDTO
        ApartmentDTO apartmentDTO = new ApartmentDTO();
        apartmentDTO.setId(100L);
        apartmentDTO.setFloor(3);
        apartmentDTO.setNumber(301);
        apartmentDTO.setBuildingDTO(buildingDTO);

        // Construir ResidentDTO completo
        sampleResidentDTO = new ResidentDTO();
        sampleResidentDTO.setId(1L);
        sampleResidentDTO.setCi(12345678L);
        sampleResidentDTO.setUserDTO(userDTO);
        sampleResidentDTO.setBuildingDTO(buildingDTO);
        sampleResidentDTO.setApartmentDTO(apartmentDTO);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createResident_whenValidInput_thenReturnsOk() throws Exception {
        Mockito.when(residentService.createResident(any(ResidentDTO.class)))
                .thenReturn(ResponseEntity.ok("Residente creado"));

        mockMvc.perform(post("/residents/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleResidentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Residente creado"));
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "RESIDENT"})
    void findAll_whenCalled_thenReturnsList() throws Exception {
        Mockito.when(residentService.findAll())
                .thenReturn(List.of(sampleResidentDTO));

        mockMvc.perform(get("/residents/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(sampleResidentDTO.getId()))
                .andExpect(jsonPath("$[0].ci").value(sampleResidentDTO.getCi()))
                .andExpect(jsonPath("$[0].userDTO.username").value(sampleResidentDTO.getUserDTO().getUsername()))
                .andExpect(jsonPath("$[0].buildingDTO.name").value(sampleResidentDTO.getBuildingDTO().getName()))
                .andExpect(jsonPath("$[0].apartmentDTO.number").value(sampleResidentDTO.getApartmentDTO().getNumber()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateResident_whenValidInput_thenReturnsOk() throws Exception {
        Mockito.when(residentService.updateResident(eq(1L), any(ResidentDTO.class)))
                .thenReturn(ResponseEntity.ok("Residente actualizado"));

        mockMvc.perform(put("/residents/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleResidentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Residente actualizado"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteResident_whenValidId_thenReturnsOk() throws Exception {
        Mockito.when(residentService.deleteResident(eq(1L)))
                .thenReturn(ResponseEntity.ok("Residente eliminado"));

        mockMvc.perform(delete("/residents/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Residente eliminado"));
    }
}
