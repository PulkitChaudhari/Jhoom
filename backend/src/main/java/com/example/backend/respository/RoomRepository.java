package com.example.backend.respository;

import com.example.backend.model.Room;
import com.example.backend.model.JhoomUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, String> {
    // Custom queries if needed
}