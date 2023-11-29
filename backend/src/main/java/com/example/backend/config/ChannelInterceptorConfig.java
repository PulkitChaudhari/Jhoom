package com.example.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

import java.nio.charset.StandardCharsets;

public class ChannelInterceptorConfig implements ChannelInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ChannelInterceptorConfig.class);

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        // Extract user information from the message (if available) and log it
        logger.info("Message sent: {}", message.toString());

        // Extract user information from the message (if available) and log it
        String payloadAsString = new String((byte[]) message.getPayload(), StandardCharsets.UTF_8);
        logger.info("Message sent to : {}", payloadAsString);
    }

    private String extractUsername(Message<?> message) {
        // Implement logic to extract username from the message (depends on your application)
        // Example assumes the username is in the message headers
        logger.info(message.toString());

        return message.getHeaders().get("username", String.class);
    }
}
