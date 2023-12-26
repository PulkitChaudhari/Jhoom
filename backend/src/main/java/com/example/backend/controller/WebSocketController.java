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

import java.util.ArrayList;
import java.util.List;

@Controller
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

    @MessageMapping("/createRoom")
    public void createRoom(String details) throws ParseException {
        try {
            JSONObject userDetails = (JSONObject) this.parser.parse(details);
            JhoomUser newUser = new JhoomUser((String) userDetails.get("username"), (String) userDetails.get("peerId"));
            boolean result = this.jhoomUserService.createUser(newUser);
            if (result) {
                Room newRoom = this.roomService.createRoom();
                this.roomService.addJhoomUserToRoom(newUser,newRoom);
                logger.info(newUser.getUserName() + " added to Room : ",newRoom.getRoomId());
                this.messagingTemplate.convertAndSend("/passport", newRoom.getRoomId());
                List<String> temp = this.roomService.returnUsers(newRoom);
                this.messagingTemplate.convertAndSend("/tempoo",temp);
            }
            else logger.info("User already exists");
        }
        catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/joinRoom")
    public void joinRoom(String details) throws ParseException {
        logger.info(details);
        try {
            JSONObject userDetails = (JSONObject) this.parser.parse(details);
            JhoomUser newUser = new JhoomUser((String) userDetails.get("username"), (String) userDetails.get("peerId"));
            boolean result = this.jhoomUserService.createUser(newUser);
            if (result) {
                Room newRoom = this.roomService.findRoom((String) userDetails.get("roomId"));
                this.roomService.addJhoomUserToRoom(newUser,newRoom);
                Room newRoom1 = this.roomService.findRoom((String) userDetails.get("roomId"));
                this.messagingTemplate.convertAndSend("/tempoo",newRoom1);
            }
            else logger.info("User already exists");
        }
        catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}