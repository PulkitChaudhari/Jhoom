package com.example.backend.controller;

import com.example.backend.model.Message;
import com.example.backend.service.MessageService;
import com.example.backend.service.WebSocketService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private WebSocketService webSocketService;

    private final MessageService messageService;

    @Autowired
    public WebSocketController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/send/message")
    public void incomingMessage(String message) throws ParseException {
        JSONParser parser = new JSONParser();
        try {
            JSONObject json = (JSONObject) parser.parse(message);
            Message incomingMessage = new Message((String)json.get("userName"),(String)json.get("message"));
            this.messageService.addMessage(incomingMessage);
            webSocketService.forwardMessage(message);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}