package com.example.backend.service;

import com.example.backend.controller.WebSocketController;
import com.example.backend.model.JhoomUser;
import com.example.backend.respository.JhoomUserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JhoomUserServiceImpl implements JhoomUserService {

    @Autowired
    private JhoomUserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(JhoomUserServiceImpl.class);

    @Override
    public void createUser(JhoomUser user) {
        Optional<JhoomUser> isUserExists = this.userRepository.findById(user.getUserName());
        if (isUserExists.isEmpty()) {
            this.userRepository.save(user);
        }
    }

}
