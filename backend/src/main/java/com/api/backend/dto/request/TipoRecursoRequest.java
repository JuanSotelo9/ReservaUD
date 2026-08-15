package com.api.backend.dto.request;

public record TipoRecursoRequest(
        String nombre,
        String descripcion,
        String imagen) {
}
