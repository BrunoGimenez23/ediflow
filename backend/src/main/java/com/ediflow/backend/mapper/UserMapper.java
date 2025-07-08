package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
@Component
public class UserMapper {

    public static UserDTO toUserDTO(User user, Admin admin) {
        if (user == null) return null;

        Long adminId = null;
        String plan = null;
        Integer trialDaysLeft = null;

        if (user.getAdminAccount() != null) {
            adminId = user.getAdminAccount().getId();
            plan = user.getAdminAccount().getPlan();
        }

        if (user.getRole().name().equals("ADMIN") && admin != null && admin.getTrialEnd() != null) {
            LocalDate today = LocalDate.now();
            LocalDate trialEnd = admin.getTrialEnd();
            trialDaysLeft = !trialEnd.isBefore(today)
                    ? (int) ChronoUnit.DAYS.between(today, trialEnd)
                    : 0;
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .adminId(adminId)
                .plan(plan)
                .trialDaysLeft(trialDaysLeft)
                .build();
    }


    public static UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;

        Long adminId = user.getAdminAccount() != null
                ? user.getAdminAccount().getId()
                : null;

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .adminId(adminId)
                .plan(user.getAdminAccount() != null ? user.getAdminAccount().getPlan() : null)
                .build();
    }
}