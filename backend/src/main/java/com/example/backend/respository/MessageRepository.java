package com.example.backend.respository;

import com.example.backend.model.Message;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, String> {
    // Custom queries if needed
}