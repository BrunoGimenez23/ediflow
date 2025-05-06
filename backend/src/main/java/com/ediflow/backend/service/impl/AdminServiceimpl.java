package com.ediflow.backend.service.impl;

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
    public ResponseEntity<String> createAdmin(AdminDTO newAdmin) {
        if (newAdmin.getUserDTO() == null) {
            return new ResponseEntity<>("Falta informacion del usuario", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(newAdmin.getUserDTO().getUsername());
        user.setEmail(newAdmin.getUserDTO().getEmail());
        user.setRole(Enums.Role.ADMIN);

        // Intentamos guardar el usuario
        try {
            user = userRepository.save(user);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Crear el admin
        Admin admin = new Admin();
        admin.setUser(user);

        // Intentamos guardar el admin
        try {
            adminRepository.save(admin);
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
    public void update(Admin admin) {
        adminRepository.save(admin);
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
    public List<AdminDTO> findAll() {
        List<Admin> admins = adminRepository.findAll();

        List<AdminDTO> adminDTOS = new ArrayList<>();

        for (Admin admin : admins) {
            if (admin.getUser() != null) {
                UserDTO userDTO = new UserDTO(
                        admin.getUser().getUsername(),
                        admin.getUser().getEmail(),
                        admin.getUser().getRole().toString()
                );
                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(admin.getId());
                adminDTO.setUserDTO(userDTO);
                adminDTOS.add(adminDTO);
            } else {
                System.out.println("Admin sin usuario: " + admin.getId());
            }
        }


        return adminDTOS;
    }
}
