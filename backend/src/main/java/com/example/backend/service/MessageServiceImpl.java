package com.example.backend.service;

import com.example.backend.common.HashGenerator;
import com.example.backend.model.JhoomUser;
import com.example.backend.model.Message;
import com.example.backend.model.Room;
import com.example.backend.respository.MessageRepository;
import com.example.backend.respository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService{

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomServiceImpl roomServiceImpl;

    @Autowired
    private JhoomUserServiceImpl jhoomUserServiceImpl;

    @Autowired
    private WebSocketService webSocketService;

    public boolean saveMessage(Message message) {
        Optional<Message> isMessageExist = this.messageRepository.findById(message.getMessageID());
        if (isMessageExist.isEmpty()) {
            Optional<Room> isRoomExists = this.roomRepository.findById(message.getRoom().getRoomId());
            if (isRoomExists.isPresent()) {
                Room room = isRoomExists.get();
                List<Message> messageList = room.getMessages();
                messageList.add(message);
                this.messageRepository.save(message);
                this.roomRepository.save(room);
            }
            return false;
        }
        else return false;
    }

    public void saveIncomingMessageAndForward(String roomId,String userName,String message) {
        Room foundRoom = this.roomServiceImpl.findRoom(roomId);
        JhoomUser foundUser = this.jhoomUserServiceImpl.findUser(userName);
        long time = System.currentTimeMillis();
        String messageHash = HashGenerator.generateHash(userName, roomId, time);
        Message incomingMessage = new Message(messageHash,foundUser,foundRoom,userName);
        saveMessage(incomingMessage);
        this.webSocketService.forwardMessage(userName,message);
    }
}
