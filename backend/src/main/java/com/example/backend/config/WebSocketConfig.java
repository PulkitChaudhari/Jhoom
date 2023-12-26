package com.example.backend.config;

import com.example.backend.service.MessageService;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final MessageService messageService;

    public WebSocketConfig(MessageService messageService) {
        this.messageService = messageService;
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/socket")
                .setAllowedOrigins("http://localhost:4200","http://localhost:52918")
                .withSockJS();
    }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app")
                .setUserDestinationPrefix("/user")
                .enableSimpleBroker("/message", "/passport","/tempoo");
    }

    @Override
    public void configureWebSocketTransport( WebSocketTransportRegistration registration )
    {
//        registration.setMessageSizeLimit( 300000 * 50 ); // default : 64 * 1024
//        registration.setSendTimeLimit( 30 * 10000 ); // default : 10 * 10000
//        registration.setSendBufferSizeLimit( 3 * 512 * 1024 ); // default : 512 * 1024
    }
}