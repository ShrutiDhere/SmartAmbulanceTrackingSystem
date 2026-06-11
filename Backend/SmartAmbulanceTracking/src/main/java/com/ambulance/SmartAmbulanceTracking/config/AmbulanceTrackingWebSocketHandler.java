package com.ambulance.SmartAmbulanceTracking.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class AmbulanceTrackingWebSocketHandler extends TextWebSocketHandler {

    // Thread-safe list to keep track of all active client connections (browsers/drivers)
    private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    // Called when a user opens the LiveTracking page
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("⚡ New tracking session established: " + session.getId());
    }

    // Called when an ambulance transmits new GPS coordinates
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("📍 Coordinates received: " + message.getPayload());
        
        // Broadcast the location update instantly to every active tracking browser window
        for (WebSocketSession webSocketSession : sessions) {
            if (webSocketSession.isOpen()) {
                webSocketSession.sendMessage(message);
            }
        }
    }

    // Called when a user closes the tab or leaves the page
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("🔌 Tracking session closed: " + session.getId());
    }
}