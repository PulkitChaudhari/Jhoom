package com.example.backend.service;

import com.example.backend.model.Message;
import com.example.backend.model.Room;
import com.example.backend.respository.MessageRepository;
import com.example.backend.respository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Vector;

public interface MessageService {

    boolean saveMessage(Message message);

    void saveIncomingMessageAndForward(String roomId,String userName,String message);
}
