package com.example.backend.service;

import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;

import java.util.List;

public interface RoomService {

    String createRoom ();

    List<String> returnUsers(String room);
    boolean addJhoomUserToRoom (JhoomUser jhoomUser, String roomId);

    Room findRoom(String roomId);
}
