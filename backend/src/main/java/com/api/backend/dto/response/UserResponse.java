package com.api.backend.dto.response;

import java.util.List;

public record UserResponse(
        Long id,
        String nombre,
        String usuario,
        String email,
        List<ReservaResponse> historial) {
}
