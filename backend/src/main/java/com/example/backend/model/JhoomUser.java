package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class JhoomUser {

    @Id
    private String userName;

    private String peerId;
}
