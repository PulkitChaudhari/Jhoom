package com.example.backend.service;

import com.example.backend.common.MeetingRoomIdGenerator;
import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;
import com.example.backend.respository.RoomRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private MeetingRoomIdGenerator meetingRoomIdGenerator;

    @Autowired
    private RoomRepository roomRepository;

    private final SimpMessagingTemplate template;

    public RoomServiceImpl(SimpMessagingTemplate template) {
        this.template = template;
    }

    @Override
    public String createRoom() {
        String newMeetingRoomId = this.meetingRoomIdGenerator.generateMeetingRoomId();
        Room newMeetingRoom = new Room(newMeetingRoomId);
        this.roomRepository.save(newMeetingRoom);
        return newMeetingRoomId;
    }

    @Override
    public boolean addJhoomUserToRoom(JhoomUser jhoomUser, String roomId) {
        Optional<Room> isRoomExists = this.roomRepository.findById(roomId);
        if (isRoomExists.isPresent()) {
            Room currRoom = isRoomExists.get();
            List<JhoomUser> users = currRoom.getUsers();
            if (users.contains(jhoomUser)) return false;
            currRoom.addUser(jhoomUser);
            this.roomRepository.save(currRoom);
            this.template.convertAndSend("/sharePeerIds",jhoomUser.getPeerId());
            return true;
        }
        return false;
    }

    public List<String> returnUsers(String roomId) {
        Optional<Room> isRoom = this.roomRepository.findById(roomId);
        if (isRoom.isPresent()) {
            Room currRoom = isRoom.get();
            List<JhoomUser> users = currRoom.getUsers();
            List<String> usersId = new ArrayList<String>();
            users.forEach(e->usersId.add(e.getPeerId()));
            return usersId;
        }
        return new ArrayList<>();
    }

    public Room findRoom(String roomId) {
        Optional<Room> isRoom = this.roomRepository.findById(roomId);
        if (isRoom.isPresent()) {
            return isRoom.get();
        }
        return new Room();
    }

    public List<JSONObject> returnMessages(String roomId) {
        Optional<Room> isRoomExists = this.roomRepository.findById(roomId);
        if(isRoomExists.isPresent()) {
            Room room = isRoomExists.get();
            List<JSONObject> messages = new ArrayList<JSONObject>();
            room.getMessages().forEach((msg -> {
                JSONObject temp = new JSONObject();
                temp.put("userName",msg.getJhoomUser().getUserName());
                temp.put("message",msg.getMessage());
                messages.add(temp);
            }));
            return messages;
        }
        return new ArrayList<JSONObject>();
    }
}
