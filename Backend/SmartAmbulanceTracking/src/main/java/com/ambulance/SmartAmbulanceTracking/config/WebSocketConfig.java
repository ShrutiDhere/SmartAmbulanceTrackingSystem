package com.ambulance.SmartAmbulanceTracking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket // Enables Spring's real-time infrastructure
public class WebSocketConfig implements WebSocketConfigurer {

    private final AmbulanceTrackingWebSocketHandler trackingWebSocketHandler;

    // Injecting the handler 
    public WebSocketConfig(AmbulanceTrackingWebSocketHandler trackingWebSocketHandler) {
        this.trackingWebSocketHandler = trackingWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Map our tracking endpoint path and allow communication from any port origin
        registry.addHandler(trackingWebSocketHandler, "/ambulance-tracking")
                .setAllowedOrigins("*");
    }
}