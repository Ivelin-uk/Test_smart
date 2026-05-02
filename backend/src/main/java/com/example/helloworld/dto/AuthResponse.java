package com.example.helloworld.dto;

public record AuthResponse(
    String message,
    Long userId,
    String name,
    String email
) {
}
