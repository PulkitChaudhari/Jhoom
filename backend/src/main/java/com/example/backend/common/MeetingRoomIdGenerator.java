package com.example.backend.common;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;

@Service
public class MeetingRoomIdGenerator {

//    private Set<String> userUpRooms;

    private HashMap<String, Integer> userUpRooms;

    MeetingRoomIdGenerator() {
        this.userUpRooms = new HashMap<>();
    }

    public String generateMeetingRoomId() {
        String meetingRoomId = String.valueOf(System.currentTimeMillis());
        String md5Hash = generateMD5Hash(meetingRoomId);
        String truncatedHash = truncateHash(md5Hash, 8);
        this.userUpRooms.put(truncatedHash, 1);
        return truncatedHash;
    }

    private String generateMD5Hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(input.getBytes());

            StringBuilder hexStringBuilder = new StringBuilder();
            for (byte b : hashBytes) {
                hexStringBuilder.append(String.format("%02x", b));
            }

            return hexStringBuilder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }

    private String truncateHash(String hash, int length) {
        return hash.substring(0, Math.min(hash.length(), length));
    }

    public Boolean isRoomJoinable(String roomId) {
        return this.userUpRooms.containsKey(roomId);
    }
}
