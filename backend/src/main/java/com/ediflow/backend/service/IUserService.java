package com.ediflow.backend.service;

import com.ediflow.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;


public interface IUserService {
    Optional<User> findById(Long id);
}
