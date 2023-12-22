package com.example.backend.respository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    // Custom queries if needed
}