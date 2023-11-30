package com.example.backend.config;

import com.example.backend.model.MessageService;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.util.Vector;

@Component
public class WebSocketEventListener implements ApplicationListener<ApplicationEvent> {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(MessageService messageService,SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof SessionConnectedEvent) {
            StompHeaderAccessor headers = StompHeaderAccessor.wrap(((SessionConnectedEvent) event).getMessage());
            String sessionId = headers.getSessionId();
            // Send the vector to the user with sessionId
            // ...
            Vector<String> messageVector = messageService.getMessageVector();
            // Send the vector to the user with the specified session ID
            messagingTemplate.convertAndSendToUser(sessionId, "/topic/messages", messageVector);
        }
    }
}