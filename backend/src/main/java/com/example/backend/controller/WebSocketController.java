package com.example.backend.controller;

import com.example.backend.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private WebSocketService webSocketService;

    @MessageMapping("/send/message")
    public void sendMessage(String message) {
        System.out.println(message);
        webSocketService.sendMessage(message);
    }
}