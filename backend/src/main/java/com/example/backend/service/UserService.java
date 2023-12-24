package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.respository.UserRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface UserService {
    boolean createUser(User user);
}
