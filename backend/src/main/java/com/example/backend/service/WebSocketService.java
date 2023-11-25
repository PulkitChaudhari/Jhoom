package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate template;

    @Autowired
    WebSocketService(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendMessage(String message) {
        this.template.convertAndSend("/message", message);
    }
}
