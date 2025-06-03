package com.ediflow.backend.auth;

import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IApartmentRepository apartmentRepository;

    @Autowired
    private IUserRepository userRepository;

    private Long testApartmentId;

    @BeforeEach
    void setup() {
        Building building = new Building();
        building.setName("Edificio Central");
        building.setAddress("Calle Falsa 123");

        Apartment apartment = new Apartment();
        apartment.setNumber(101);
        apartment.setFloor(1);
        apartment.setBuilding(building);
    }

    @Test
    void registerAdmin_shouldReturnToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("admin1");
        request.setEmail("admin1@ediflow.com");
        request.setPassword("adminpass");
        request.setInviteCode("EDIFLOW-ADMIN-2025");

        mockMvc.perform(post("/auth/register/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    void registerResident_shouldReturn201() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("residente1");
        request.setEmail("res1@ediflow.com");
        request.setPassword("respass");
        request.setApartmentId(testApartmentId);

        mockMvc.perform(post("/auth/register/resident")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void login_shouldReturnToken() throws Exception {
        // Preparamos un usuario existente
        RegisterRequest register = new RegisterRequest();
        register.setUsername("adminLogin");
        register.setEmail("adminLogin@ediflow.com");
        register.setPassword("adminpass");
        register.setInviteCode("EDIFLOW-ADMIN-2025");

        mockMvc.perform(post("/auth/register/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk());

        // Login
        AuthenticationRequest login = new AuthenticationRequest();
        login.setEmail("adminLogin@ediflow.com");
        login.setPassword("adminpass");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()));
    }
}
