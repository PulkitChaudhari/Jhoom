package com.example.backend.respository;

import com.example.backend.model.JhoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JhoomUserRepository extends JpaRepository<JhoomUser, String> {
    // Custom queries if needed
}