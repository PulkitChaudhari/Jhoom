package com.example.backend.service;

import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RoomService {

    Room createRoom ();

    List<String> returnUsers(Room room);
    boolean addJhoomUserToRoom (JhoomUser jhoomUser, Room room);

    Room findRoom(String roomId);
}
