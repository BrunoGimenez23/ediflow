package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.exception.ResourceNotFoundException;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceimpl implements IAdminService {
    @Autowired
    private IAdminRepository adminRepository;
    @Autowired
    private IUserRepository userRepository;


    @Autowired
    public AdminServiceimpl(IAdminRepository adminRepository, IUserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AdminDTO createAdmin(AdminDTO newAdmin) {
        if (newAdmin.getUserDTO() == null) {
            throw new IllegalArgumentException("Falta información del usuario");
        }

        // Crear y guardar el User
        User user = new User();
        user.setUsername(newAdmin.getUserDTO().getUsername());
        user.setPassword("admin123");
        user.setEmail(newAdmin.getUserDTO().getEmail());
        user.setRole(Role.ADMIN);

        user = userRepository.save(user);

        // Crear y guardar el Admin
        Admin admin = new Admin();
        admin.setUser(user);
        admin = adminRepository.save(admin);

        // Preparar el AdminDTO de respuesta
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());

        AdminDTO responseDTO = new AdminDTO();
        responseDTO.setId(admin.getId());
        responseDTO.setUserDTO(userDTO);
        return responseDTO;
    }

    @Override
    public Optional<AdminDTO> getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        // Convertimos a DTO manualmente
        UserDTO userDTO = new UserDTO();
        userDTO.setId(admin.getUser().getId());
        userDTO.setUsername(admin.getUser().getUsername());
        userDTO.setEmail(admin.getUser().getEmail());

        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setUserDTO(userDTO);

        List<BuildingSummaryDTO> buildingSummaryDTO = admin.getBuildings().stream().map(building -> {
            BuildingSummaryDTO dto = new BuildingSummaryDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());

            return dto;
        }).collect(Collectors.toList());

        adminDTO.setBuildings(buildingSummaryDTO);

        return Optional.of(adminDTO);
    }


    @Override
    public ResponseEntity<String> updateAdmin(Long id, AdminDTO adminDTO) {
        // 1. Validar que el DTO no sea nulo
        if (adminDTO == null || adminDTO.getUserDTO() == null) {
            return new ResponseEntity<>("Falta información del administrador o usuario", HttpStatus.BAD_REQUEST);
        }

        // 2. Buscar el admin por ID en una sola consulta
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isEmpty()) {
            return new ResponseEntity<>("El admin con id: " + id + " no existe", HttpStatus.BAD_REQUEST);
        }

        // 3. Obtener el admin existente
        Admin updateAdmin = optionalAdmin.get();

        // 4. Validar y actualizar el usuario asociado
        User user = updateAdmin.getUser();
        if (user == null) {
            return new ResponseEntity<>("El admin no tiene un usuario asociado", HttpStatus.BAD_REQUEST);
        }

        // 5. Actualizar campos del usuario si vienen con datos
        if (adminDTO.getUserDTO().getUsername() != null) {
            user.setUsername(adminDTO.getUserDTO().getUsername());
        }
        if (adminDTO.getUserDTO().getEmail() != null) {
            user.setEmail(adminDTO.getUserDTO().getEmail());
        }

        // 6. Guardar cambios
        try {
            adminRepository.save(updateAdmin);
            return new ResponseEntity<>("El admin se actualizó correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el admin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteAdmin(Long id) {
        boolean adminExist = adminRepository.findById(id).isPresent();
        if (adminExist) {
            adminRepository.deleteById(id);
            return new ResponseEntity<>("Admin eliminado correctamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Admin no encontrado",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @Transactional
    public List<AdminDTO> findAll() {
        List<Admin> admins = adminRepository.findAll();
        List<AdminDTO> adminDTOS = new ArrayList<>();

        for (Admin admin : admins) {
            if (admin.getUser() != null) {
                UserDTO userDTO = new UserDTO(
                        admin.getUser().getId(),
                        admin.getUser().getUsername(),
                        admin.getUser().getEmail(),
                        admin.getUser().getRole()
                );

                // Convertir lista de Building a lista de BuildingSummaryDTO
                List<BuildingSummaryDTO> buildingSummaries = new ArrayList<>();
                if (admin.getBuildings() != null) {
                    for (Building building : admin.getBuildings()) {
                        BuildingSummaryDTO summary = new BuildingSummaryDTO(
                                building.getId(),
                                building.getName(),
                                building.getAddress()
                        );
                        buildingSummaries.add(summary);
                    }
                }

                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(admin.getId());
                adminDTO.setUserDTO(userDTO);
                adminDTO.setBuildings(buildingSummaries);  // <-- Aquí asignás la lista de BuildingSummaryDTO

                adminDTOS.add(adminDTO);
            }
        }
        return adminDTOS;
    }

    @Override
    public boolean existsByUserId(Long userId) {
        return adminRepository.existsByUserId(userId);
    }
}
