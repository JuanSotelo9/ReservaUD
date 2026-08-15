package com.api.backend.dto.response;

public record TopRecursoResponse(
        Integer idRecurso,
        String nombre,
        Long totalReservas) {
}
