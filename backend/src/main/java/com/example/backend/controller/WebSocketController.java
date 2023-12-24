package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.MessageService;
import com.example.backend.service.UserService;
import com.example.backend.service.WebSocketService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import com.example.backend.service.UserService;

@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private WebSocketService webSocketService;

    private final MessageService messageService;
    private final JSONParser parser;

    @Autowired
    public WebSocketController(MessageService messageService) {
        this.messageService = messageService;
        this.parser = new JSONParser();
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
        logger.info(details);
        try {
            JSONObject userDetails = (JSONObject) this.parser.parse(details);
            User newUser = new User((String) userDetails.get("username"));
            boolean result = this.userService.createUser(newUser);
            logger.info(String.valueOf(result));
        }
        catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/joinRoom")
    public void joinRoom(String message) {
        logger.info(message);
    }
}