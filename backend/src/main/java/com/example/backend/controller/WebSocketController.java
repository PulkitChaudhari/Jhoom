package com.example.backend.controller;

import com.example.backend.model.MessageService;
import com.example.backend.service.WebSocketService;
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
    public void sendMessage(String message) {
        System.out.println(message);
        this.messageService.addMessage(message);
        webSocketService.sendMessage(message);
    }
}