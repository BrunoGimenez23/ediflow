package com.ediflow.backend.service.impl;

import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IUserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private IUserRepository userRepository;


    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
