package com.example.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
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

    public void forwardMessage(String userName,String message) {
        JSONObject response  = new JSONObject();
        response.put("message",message);
        response.put("userName",userName);
        this.template.convertAndSend("/messages", response);
    }

    public void sendOffer(String userName,String offer) {
        JSONObject response  = new JSONObject();
        response.put("offer",offer);
        this.template.convertAndSend("/offer/"+userName, response);
    }

    public void sendRoomNotif(String roomId,JSONObject roomNotif) {
        String toSendUrl = "/room/update/" + roomId;
        this.template.convertAndSend(toSendUrl,roomNotif);
    }
}
