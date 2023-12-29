package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Room {
    @Id
    String roomId;

    @OneToMany(fetch = FetchType.EAGER)
    List<JhoomUser> users;

    public Room(String roomId) {
        this.roomId = roomId;
        this.users = new ArrayList<>();
    }

    public boolean addUser(JhoomUser jhoomUser) {
        this.users.add(jhoomUser);
        return true;
    }

}
