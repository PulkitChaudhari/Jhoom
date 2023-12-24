package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.respository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    UserServiceImpl(UserRepository userRepository) {this.userRepository = userRepository;}

    private final UserRepository userRepository;

    @Override
    public boolean createUser(User user) {
        this.userRepository.save(user);
        return true;
    }
}
