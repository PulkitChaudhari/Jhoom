package com.example.backend.service;

import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;
import org.springframework.stereotype.Service;

public interface RoomService {

    Room createRoom ();

    boolean addJhoomUserToRoom (JhoomUser jhoomUser, Room room);
}
