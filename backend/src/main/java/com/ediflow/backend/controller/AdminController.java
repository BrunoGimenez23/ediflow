package com.ediflow.backend.controller;

import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private IAdminService iadminservice;

    @PostMapping("/create")
    public ResponseEntity<String> createAdmin(@RequestBody AdminDTO newAdmin) {
        ResponseEntity<String> response = iadminservice.createAdmin(newAdmin); // Obtenemos la respuesta del servicio
        return response; // Devolvemos la respuesta que contiene el estado real del proceso
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        return iadminservice.deleteAdmin(id);

    }

    @GetMapping("/all")
    public ResponseEntity<List<AdminDTO>> findAll() {
        List<AdminDTO> admins = iadminservice.findAll();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

}
