package com.example.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate template;
    private final ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    @Autowired
    WebSocketService(SimpMessagingTemplate template, ObjectMapper objectMapper) {
        this.template = template;
        this.objectMapper = objectMapper;
    }

    public void forwardMessage(String message) {
        String msgToString = message.toString();
        this.template.convertAndSend("/message", message);
    }
}
