package com.example.backend.service;

import com.example.backend.common.MeetingRoomIdGenerator;
import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;
import com.example.backend.respository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    MeetingRoomIdGenerator meetingRoomIdGenerator;

    @Autowired
    RoomRepository roomRepository;

    @Override
    public Room createRoom() {
        String newMeetingRoomId = this.meetingRoomIdGenerator.generateMeetingRoomId();
        Room newMeetingRoom = new Room(newMeetingRoomId);
        this.roomRepository.save(newMeetingRoom);
        return newMeetingRoom;
    }

    @Override
    public boolean addJhoomUserToRoom(JhoomUser jhoomUser, Room room) {
        Optional<Room> isRoomExists = this.roomRepository.findById(room.getRoomId());
        if (isRoomExists.isPresent()) {
            Room currRoom = isRoomExists.get();
            currRoom.addUser(jhoomUser);
            this.roomRepository.save(currRoom);
            return true;
        }
        return false;
    }
}
