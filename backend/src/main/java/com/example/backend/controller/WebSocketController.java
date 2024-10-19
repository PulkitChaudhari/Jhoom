package com.example.backend.controller;

import com.example.backend.common.HashGenerator;
import com.example.backend.common.MeetingRoomIdGenerator;
import com.example.backend.service.*;
import org.apache.catalina.connector.Response;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;

@RestController
@CrossOrigin
public class WebSocketController {
    @Autowired
    private WebSocketService webSocketService;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MeetingRoomIdGenerator meetingRoomIdGenerator;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate
    , MeetingRoomIdGenerator meetingRoomIdGenerator) {
        this.meetingRoomIdGenerator = meetingRoomIdGenerator;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/room/notif")
    public void incomingRoomNotif(@Payload JSONObject roomNotif) {
        this.webSocketService.sendRoomNotif((String) roomNotif.get("roomId"),roomNotif);
    }

    @MessageMapping("/offer")
    public void incomingOffer(@Payload JSONObject requestOffer) {

    }

    @GetMapping("/createRoom")
    public ResponseEntity<String> createRoom() {
        String newMeetingRoomId = MeetingRoomIdGenerator.generateMeetingRoomId();
        return new ResponseEntity<String>(newMeetingRoomId, HttpStatus.OK);
    }

    @PostMapping("/joinRoom/{roomId}")
    public Boolean joinRoom() {
        return true;
    }

    @GetMapping("/getMessage")
    public ResponseEntity<String> getMessage() {
        String newMeetingRoomId = "Hello World1";
        return new ResponseEntity<String>(newMeetingRoomId, HttpStatus.OK);
    }
}
