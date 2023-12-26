package com.example.backend.model;

import jakarta.persistence.ForeignKey;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Room {
    @Id
    String roomId;

    @OneToMany
    List<JhoomUser> users;

    public Room(String roomId) {
        this.roomId = roomId;
    }

    public boolean addUser(JhoomUser jhoomUser) {
        this.users.add(jhoomUser);
        return true;
    }

}
