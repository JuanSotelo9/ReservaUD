package com.api.backend.dto.request;

public record RecursoRequest(
        String nombre,
        String descripcion,
        Integer idTipoRecurso) {
}
