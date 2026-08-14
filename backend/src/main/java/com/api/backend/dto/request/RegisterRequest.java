package com.api.backend.dto.request;

public record RegisterRequest(
        String id,
        String nombre,
        String apellido,
        String usuario,
        String email,
        String password) {
}
