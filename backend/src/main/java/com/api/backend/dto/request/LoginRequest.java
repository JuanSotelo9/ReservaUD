package com.api.backend.dto.request;

public record LoginRequest(
        String usuario,
        String password) {
}
