package com.api.backend.dto.response;

public record RecursoResponse(
        Integer id,
        String nombre,
        String descripcion,
        Integer idTipoRecurso,
        String nombreTipoRecurso,
        Float calificacionPromedio) {
}
