package com.example.backend.service;

import com.example.backend.model.Message;
import com.example.backend.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Vector;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
}
