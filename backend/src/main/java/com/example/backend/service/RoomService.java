package com.example.backend.service;

import com.example.backend.model.JhoomUser;
import com.example.backend.model.Message;
import com.example.backend.model.Room;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

public interface RoomService {

    String createRoom ();
    List<String> returnUsers(String room);
    boolean addJhoomUserToRoom(JhoomUser jhoomUser, String roomId);
    Room findRoom(String roomId);
    List<JSONObject> returnMessages(String roomId);

}
