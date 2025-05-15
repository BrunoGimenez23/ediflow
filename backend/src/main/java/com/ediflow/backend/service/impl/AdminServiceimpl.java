package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Enums;
import com.ediflow.backend.entity.User;
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
    public ResponseEntity<String> createAdmin(@RequestBody AdminDTO newAdmin) {
        if (newAdmin.getUserDTO() == null) {
            return new ResponseEntity<>("Falta informacion del usuario", HttpStatus.BAD_REQUEST);
        }

        // 1. Crear el User
        User user = new User();
        user.setId(newAdmin.getUserDTO().getId());
        user.setUsername(newAdmin.getUserDTO().getUsername());
        user.setEmail(newAdmin.getUserDTO().getEmail());
        user.setRole(Enums.Role.ADMIN);  // Establecer el rol del usuario

        // 2. Guardar el User primero
        try {
            user = userRepository.save(user); // Guardamos el User
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // 3. Crear el Admin y asociarlo con el User
        Admin admin = new Admin();
        admin.setUser(user);  // Asociamos el User creado con el Admin

        // 4. Guardar el Admin con el User ya asociado
        try {
            adminRepository.save(admin);  // Guardamos el Admin con la relación establecida
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el admin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("Admin creado correctamente", HttpStatus.CREATED);
    }

    @Override
    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public ResponseEntity<String> updateAdmin(Long id, AdminDTO adminDTO) {
        boolean adminExist = adminRepository.existsById(id);
        if (!adminExist) {
            return new ResponseEntity<>("El admin con id: " + id + "no existe", HttpStatus.BAD_REQUEST);
        }
        Admin updateAdmin = adminRepository.findById(id).orElse(null);
        if (updateAdmin == null) {
            return new ResponseEntity<>("El admin con id: " + id + " no existe", HttpStatus.BAD_REQUEST);
        }
        if (adminDTO.getUserDTO() == null){
            return new ResponseEntity<>("Falta información del usuario", HttpStatus.BAD_REQUEST);
        }
        User user = updateAdmin.getUser();
        if (user == null){
            return new ResponseEntity<>("El admin no tiene un usuario asociado", HttpStatus.BAD_REQUEST);
        }

        user.setUsername(adminDTO.getUserDTO().getUsername());
        user.setEmail(adminDTO.getUserDTO().getEmail());

        try {
            adminRepository.save(updateAdmin);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el admin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("El admin se actualizo correctamente", HttpStatus.OK);
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

                // Convertir lista de Building a lista de BuildingDTO
                List<BuildingDTO> buildingDTOS = new ArrayList<>();
                if (admin.getBuildings() != null) {
                    for (Building building : admin.getBuildings()) {
                        BuildingDTO buildingDTO = new BuildingDTO(
                                building.getId(),
                                building.getName(),
                                building.getAddress()
                                // si tenés más campos, agregalos acá
                        );
                        buildingDTOS.add(buildingDTO);
                    }
                }

                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(admin.getId());
                adminDTO.setUserDTO(userDTO);
                adminDTO.setBuildings(buildingDTOS);  // <-- Aquí seteás la lista de edificios

                adminDTOS.add(adminDTO);
            } else {
                System.out.println("Admin sin usuario: " + admin.getId());
            }
        }
        return adminDTOS;
    }
}
