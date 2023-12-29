package com.example.backend.controller;

import com.example.backend.model.JhoomUser;
import com.example.backend.model.Room;
import com.example.backend.service.JhoomUserService;
import com.example.backend.service.MessageService;
import com.example.backend.service.RoomService;
import com.example.backend.service.WebSocketService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private JhoomUserService jhoomUserService;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private RoomService roomService;

    private final SimpMessagingTemplate messagingTemplate;

    private final MessageService messageService;
    private final JSONParser parser;

    @Autowired
    public WebSocketController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.parser = new JSONParser();
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/send/message")
    public void incomingMessage(String message) throws ParseException {
        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(message);
//            Message incomingMessage = new Message((String)json.get("userName"),(String)json.get("message"));
//            this.messageService.addMessage(incomingMessage);
//            webSocketService.forwardMessage(message);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/createRoom")
    @CrossOrigin
    public String createRoom(@RequestBody JhoomUser jhoomUser) {
        this.jhoomUserService.createUser(jhoomUser);
        String newRoomId = this.roomService.createRoom();
        boolean isJhoomUserAdded = this.roomService.addJhoomUserToRoom(jhoomUser,newRoomId);
        if (isJhoomUserAdded) return newRoomId;
        else return "Error adding user to new room";
    }

    @PostMapping("/joinRoom/{roomId}")
    @CrossOrigin
    public String joinRoom(@RequestBody JhoomUser jhoomUser,@PathVariable("roomId") String roomId) {
        this.jhoomUserService.createUser(jhoomUser);
        boolean isJhoomUserAdded = this.roomService.addJhoomUserToRoom(jhoomUser,roomId);
        if (isJhoomUserAdded) return "User Connected";
        else return "Error adding user to room, please check room Id";
    }

    @GetMapping("/getUsers/{roomId}")
    public List<String> getUsers(@PathVariable("roomId") String roomId) {
        return this.roomService.returnUsers(roomId);
    }

}