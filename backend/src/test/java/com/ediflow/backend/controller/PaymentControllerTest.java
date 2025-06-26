package com.ediflow.backend.controller;

import com.ediflow.backend.configuration.JwtService;
import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IPaymentService;
import com.ediflow.backend.service.IUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPaymentService paymentService;

    @MockBean
    private IUserService userService;

    @MockBean
    private IAdminService adminService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private PaymentDTO paymentDTO;

    @BeforeEach
    void setup() {
        ResidentDTO residentDTO = new ResidentDTO();
        residentDTO.setId(1L);
        residentDTO.setCi(12345678L);
        residentDTO.setUserDTO(new UserDTO(1L, "residentUser", "resident@email.com", "1234", Role.RESIDENT, "Resident Full Name"));

        paymentDTO = new PaymentDTO();
        paymentDTO.setId(1L);
        paymentDTO.setAmount(BigDecimal.valueOf(1000));
        paymentDTO.setConcept("Expensas");
        paymentDTO.setStatus(PaymentStatus.PENDING);
        paymentDTO.setResidentDTO(residentDTO);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createPayment_returnsOk() throws Exception {
        Mockito.when(paymentService.createPayment(any(PaymentDTO.class)))
                .thenReturn(ResponseEntity.ok(Map.of("message", "Pago creado")));

        mockMvc.perform(post("/payment/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Pago creado"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void findAll_returnsList() throws Exception {
        Mockito.when(paymentService.findAll()).thenReturn(List.of(paymentDTO));

        mockMvc.perform(get("/payment/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(paymentDTO.getId()))
                .andExpect(jsonPath("$[0].amount").value(paymentDTO.getAmount()))
                .andExpect(jsonPath("$[0].concept").value(paymentDTO.getConcept()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deletePayment_returnsOk() throws Exception {
        Mockito.when(paymentService.deletePayment(eq(1L)))
                .thenReturn(ResponseEntity.ok(Map.of("message", "Pago eliminado")));

        mockMvc.perform(delete("/payment/delete/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Pago eliminado"));
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "RESIDENT"})
    void paymentByBuilding_returnsList() throws Exception {
        PaymentByBuildingDTO dto = new PaymentByBuildingDTO();
        dto.setId(1L);
        dto.setAmount(BigDecimal.valueOf(1000));
        dto.setDate(LocalDate.now());

        Mockito.when(paymentService.paymentByBuilding(1L))
                .thenReturn(ResponseEntity.ok(List.of(dto)));

        mockMvc.perform(get("/payment/by-building/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(dto.getId()))
                .andExpect(jsonPath("$[0].amount").value(dto.getAmount()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "RESIDENT"})
    void getPaymentById_asAdminOrOwner_returnsPayment() throws Exception {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(BigDecimal.valueOf(1000));
        payment.setConcept("Expensas");
        payment.setStatus(PaymentStatus.PAID);

        User user = new User();
        user.setId(1L);

        Resident resident = new Resident();
        resident.setUser(user);
        payment.setResident(resident);

        Mockito.when(paymentService.findById(1L)).thenReturn(Optional.of(payment));
        Mockito.when(userService.findById(1L)).thenReturn(Optional.of(user));
        Mockito.when(adminService.existsByUserId(1L)).thenReturn(false);

        mockMvc.perform(get("/payment/1")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(payment.getId()))
                .andExpect(jsonPath("$.amount").value(payment.getAmount()))
                .andExpect(jsonPath("$.concept").value(payment.getConcept()));
    }
}