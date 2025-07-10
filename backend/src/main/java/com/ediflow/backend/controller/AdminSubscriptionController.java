package com.ediflow.backend.controller;

import com.ediflow.backend.dto.AssignPlan.AssignPlanRequest;
import com.ediflow.backend.service.IAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subscription")
public class AdminSubscriptionController {

    private final IAdminService adminService;

    public AdminSubscriptionController(IAdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/assign-plan")
    public ResponseEntity<String> assignPlan(@RequestBody AssignPlanRequest request,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        if (!userDetails.getUsername().equals("bruno@ediflow.com")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        // Retorná directamente la respuesta que devuelve el servicio
        return adminService.assignPlan(request.getEmail(), request.getPlanName(), request.getDuration());
    }

}

