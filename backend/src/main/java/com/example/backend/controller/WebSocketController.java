package com.example.backend.controller;

import com.example.backend.common.MeetingRoomIdGenerator;
import com.example.backend.service.WebSocketService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

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
        this.webSocketService.sendRoomNotif((String) roomNotif.get("roomId"), roomNotif);
    }

    @GetMapping("/createRoom")
    public ResponseEntity<String> createRoom() {
        String newMeetingRoomId = meetingRoomIdGenerator.generateMeetingRoomId();
        return new ResponseEntity<String>(newMeetingRoomId, HttpStatus.OK);
    }

    @PostMapping("/joinRoom/{roomId}")
    public Boolean joinRoom(@PathVariable String roomId) {
        return this.meetingRoomIdGenerator.isRoomJoinable(roomId);
    }

    @GetMapping("/getMessage")
    public ResponseEntity<String> getMessage() {
        String newMeetingRoomId = "Hello World";
        return new ResponseEntity<String>(newMeetingRoomId, HttpStatus.OK);
    }
}
