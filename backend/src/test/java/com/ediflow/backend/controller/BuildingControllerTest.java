package com.ediflow.backend.controller;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BuildingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private BuildingDTO createValidBuildingDTO() {
        BuildingDTO dto = new BuildingDTO();
        dto.setName("Edificio Test");
        dto.setAddress("Calle Falsa 123");
        dto.setResidentCount(0);
        return dto;
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenCreateBuildingWithValidData_thenReturnOk() throws Exception {
        BuildingDTO buildingDTO = createValidBuildingDTO();

        mockMvc.perform(post("/buildings/building")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildingDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "RESIDENT")
    void whenResidentTriesToCreateBuilding_thenForbidden() throws Exception {
        BuildingDTO buildingDTO = createValidBuildingDTO();

        mockMvc.perform(post("/buildings/building")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildingDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenGetBuildingsList_thenReturnOk() throws Exception {
        mockMvc.perform(get("/buildings/admin/buildings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenUpdateBuilding_thenReturnOk() throws Exception {
        BuildingDTO buildingDTO = createValidBuildingDTO();

        mockMvc.perform(put("/buildings/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildingDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenDeleteBuilding_thenReturnOk() throws Exception {
        mockMvc.perform(delete("/buildings/delete/1"))
                .andExpect(status().isOk());
    }
}
