package com.example.backend.service;

import com.example.backend.model.JhoomUser;
import com.example.backend.respository.JhoomUserRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface JhoomUserService {
    void createUser(JhoomUser user);

    JhoomUser findUser(String userName);
}
