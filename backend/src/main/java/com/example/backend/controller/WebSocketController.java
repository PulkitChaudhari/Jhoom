package com.example.backend.controller;

import com.example.backend.common.HashGenerator;
import com.example.backend.model.JhoomUser;
import com.example.backend.model.MessageRequestDTO;
import com.example.backend.service.*;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private JhoomUserServiceImpl jhoomUserServiceImpl;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private RoomServiceImpl roomServiceImpl;

    @Autowired
    private HashGenerator hashGenerator;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private  MessageServiceImpl messageServiceImpl;

    @Autowired
    public WebSocketController(MessageServiceImpl messageServiceImpl, SimpMessagingTemplate messagingTemplate) {
        this.messageServiceImpl = messageServiceImpl;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/send/message")
    public String incomingMessage(@Payload MessageRequestDTO requestMessage) {
        if (requestMessage.getUserName() != null) {
            this.messageServiceImpl.saveIncomingMessageAndForward(requestMessage.getRoomId(),requestMessage.getUserName(),requestMessage.getMessage());
        }
        return "HEHEHEHEHE";
    }

    @PostMapping("/createRoom")
    public String createRoom(@RequestBody JhoomUser jhoomUser) {
        this.jhoomUserServiceImpl.createUser(jhoomUser);
        String newRoomId = this.roomServiceImpl.createRoom();
        this.roomServiceImpl.addJhoomUserToRoom(jhoomUser,newRoomId);
        return newRoomId;
    }

    @PostMapping("/joinRoom/{roomId}")
    public Boolean joinRoom(@RequestBody JhoomUser jhoomUser,@PathVariable("roomId") String roomId) {
        this.jhoomUserServiceImpl.createUser(jhoomUser);
        return this.roomServiceImpl.addJhoomUserToRoom(jhoomUser,roomId);
    }

    @GetMapping("/getUsers/{roomId}")
    public List<String> getUsers(@PathVariable("roomId") String roomId) {
        return this.roomServiceImpl.returnUsers(roomId);
    }

    @GetMapping("/getMessages/{roomId}")
    public List<JSONObject> returnMessages(@PathVariable("roomId") String roomId) {
        return this.roomServiceImpl.returnMessages(roomId);
    }
}