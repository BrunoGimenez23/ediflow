package com.ediflow.backend.controller;

import com.ediflow.backend.configuration.JwtService;
import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.service.IApartmentService;
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
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApartmentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ApartmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IApartmentService apartmentService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private ApartmentDTO sampleApartmentDTO;
    private BuildingDTO sampleBuildingDTO;

    @BeforeEach
    void setup() {
        sampleBuildingDTO = new BuildingDTO();
        sampleBuildingDTO.setId(1L);
        sampleBuildingDTO.setName("Edificio Central");
        sampleBuildingDTO.setAddress("Calle Falsa 123");

        sampleApartmentDTO = new ApartmentDTO();
        sampleApartmentDTO.setId(1L);
        sampleApartmentDTO.setFloor(3);
        sampleApartmentDTO.setNumber(301);
        sampleApartmentDTO.setBuildingDTO(sampleBuildingDTO);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createApartment_whenValidInput_thenReturnsOk() throws Exception {
        Mockito.when(apartmentService.createApartment(any(ApartmentDTO.class)))
                .thenReturn(ResponseEntity.ok(Map.of("message", "Apartamento creado")));

        mockMvc.perform(post("/apartment/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleApartmentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Apartamento creado"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void findAll_whenCalled_thenReturnsList() throws Exception {
        Mockito.when(apartmentService.findAll())
                .thenReturn(List.of(sampleApartmentDTO));

        mockMvc.perform(get("/apartment/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(sampleApartmentDTO.getId()))
                .andExpect(jsonPath("$[0].floor").value(sampleApartmentDTO.getFloor()))
                .andExpect(jsonPath("$[0].number").value(sampleApartmentDTO.getNumber()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteApartment_whenValidId_thenReturnsOk() throws Exception {
        Mockito.when(apartmentService.deleteApartment(eq(1L)))
                .thenReturn(ResponseEntity.ok(Map.of("message", "Apartamento eliminado")));

        mockMvc.perform(delete("/apartment/delete/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Apartamento eliminado"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateApartment_whenValidInput_thenReturnsOk() throws Exception {
        Mockito.when(apartmentService.updateApartment(eq(1L), any(ApartmentDTO.class)))
                .thenReturn(ResponseEntity.ok(Map.of("message", "Apartamento actualizado")));

        mockMvc.perform(put("/apartment/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleApartmentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Apartamento actualizado"));
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "RESIDENT"})
    void getApartmentsByBuilding_whenValidBuildingId_thenReturnsList() throws Exception {
        ApartmentSummaryDTO summaryDTO = new ApartmentSummaryDTO(1L, 3, 301);
        Mockito.when(apartmentService.findByBuildingId(eq(1L)))
                .thenReturn(List.of(summaryDTO));

        mockMvc.perform(get("/apartment/by-building/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(summaryDTO.getId()))
                .andExpect(jsonPath("$[0].floor").value(summaryDTO.getFloor()))
                .andExpect(jsonPath("$[0].number").value(summaryDTO.getNumber()));
    }
}
