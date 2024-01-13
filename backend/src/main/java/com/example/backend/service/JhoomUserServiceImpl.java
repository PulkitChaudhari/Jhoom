package com.example.backend.service;

import com.example.backend.controller.WebSocketController;
import com.example.backend.model.JhoomUser;
import com.example.backend.respository.JhoomUserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class JhoomUserServiceImpl implements JhoomUserService {

    @Autowired
    private JhoomUserRepository userRepository;

    @Override
    public void createUser(JhoomUser user) {
        Optional<JhoomUser> isUserExists = this.userRepository.findById(user.getUserName());
        if (isUserExists.isEmpty()) {
            this.userRepository.save(user);
        }
    }

    @Override
    public JhoomUser findUser(String userName) {
        Optional<JhoomUser> isUserExists = this.userRepository.findById(userName);
        if (isUserExists.isPresent()) {
            return isUserExists.get();
        }
        else return new JhoomUser();
    }

}
