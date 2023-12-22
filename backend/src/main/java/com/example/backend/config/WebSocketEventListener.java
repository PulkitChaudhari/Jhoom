package com.example.backend.config;

import com.example.backend.model.Message;
import com.example.backend.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.util.Vector;

@Component
public class WebSocketEventListener implements ApplicationListener<ApplicationEvent> {

    private final MessageService messageService;

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof SessionConnectedEvent) {
            Vector<Message> messageVector = messageService.getMessageVector();
            this.messagingTemplate.convertAndSend("/passport","hello");
        }
    }
}