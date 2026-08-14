package com.api.backend.dto.response;

public record TipoRecursoResponse(
        Integer id,
        String nombre,
        String descripcion,
        String imagen) {
}
