package com.example.backend.common;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class MeetingRoomIdGenerator {

    public static String generateMeetingRoomId() {
        // Generate a unique identifier for the meeting room (e.g., timestamp)
        String meetingRoomId = String.valueOf(System.currentTimeMillis());

        // Generate an MD5 hash
        String md5Hash = generateMD5Hash(meetingRoomId);

        // Truncate the hash to the desired length
        String truncatedHash = truncateHash(md5Hash, 8);

        return truncatedHash;
    }

    private static String generateMD5Hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(input.getBytes());

            // Convert bytes to hexadecimal representation
            StringBuilder hexStringBuilder = new StringBuilder();
            for (byte b : hashBytes) {
                hexStringBuilder.append(String.format("%02x", b));
            }

            return hexStringBuilder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }

    private static String truncateHash(String hash, int length) {
        // Truncate or pad the hash to the specified length
        return hash.substring(0, Math.min(hash.length(), length));
    }
}
