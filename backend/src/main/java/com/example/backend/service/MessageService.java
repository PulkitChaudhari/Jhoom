package com.example.backend.service;

import com.example.backend.model.Message;
import org.springframework.stereotype.Service;

import java.util.Vector;

@Service
public class MessageService {
        private final Vector<Message> messageVector = new Vector<Message>();

        public void addMessage(Message message) {
            messageVector.add(message);
        }

        public Vector<Message> getMessageVector() {
            return messageVector;
        }
}
