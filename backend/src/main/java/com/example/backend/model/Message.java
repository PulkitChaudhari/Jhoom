package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Message {

    @Id
    private String messageID;

    @ManyToOne
    @JoinColumn(name = "user_username", nullable = false)
    private JhoomUser jhoomUser;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    private String message;
}
