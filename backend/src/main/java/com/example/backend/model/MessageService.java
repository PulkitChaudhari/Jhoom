package com.example.backend.model;
import org.springframework.stereotype.Service;
import java.util.Vector;

@Service
public class MessageService {
    private final Vector<String> messageVector = new Vector<>();

    public void addMessage(String message) {
        messageVector.add(message);
    }

    public Vector<String> getMessageVector() {
        return messageVector;
    }
}